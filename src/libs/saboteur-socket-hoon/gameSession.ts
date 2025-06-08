/* eslint-disable @typescript-eslint/no-explicit-any */
import { act } from "react";

import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";

import { HSSaboteurSocket, SocketAction } from "./socket";

type RequestActionEvent = CustomEvent<{
  action: SaboteurAction.Request.Actions;
  primitive: SocketAction.Request.Actions;
}>;
type ResponseActionEvent = CustomEvent<SocketAction.Response.Actions>;

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: MySaboteurPlayer;

  private readonly inTarget = new EventTarget();
  private readonly outTarget = new EventTarget();

  constructor(
    socket: HSSaboteurSocket,
    roomId: string,
    player: MySaboteurPlayer,
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = player;

    this.outTarget.addEventListener("any", ((event: RequestActionEvent) => {
      const { action, primitive } = event.detail;

      this.socket.emit("game_action", {
        room: this.roomId,
        player: this.player.id,
        action: primitive,
        requestId: action.requestId,
      });
    }) as any);

    this.socket.onAny((type, data) => {
      if (type !== "game_update" && type !== "private_game_update") return;

      const actions =
        SocketAction.AbstractResponse.fromPrimitive(data).toSaboteurAction();

      for (const action of actions) {
        const target = SaboteurAction.Response.Private.actionTypes.includes(
          action.type as any,
        )
          ? "private"
          : "public";

        this.inTarget.dispatchEvent(new CustomEvent("any", { detail: action }));
        this.inTarget.dispatchEvent(
          new CustomEvent(`${target}:${action.type}`, { detail: action }),
        );
      }
    });
  }

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
    gameSession: SaboteurSession,
  ) {
    const primitive = action.toSocketAction(gameSession).toPrimitive();

    this.outTarget.dispatchEvent(
      new CustomEvent("any", { detail: { action, primitive } }),
    );
  }

  on<
    TSaboteurActionType extends Exclude<
      SaboteurAction.Response.ActionType,
      "game_started"
    >,
    TSaboteurActionClass extends
      SaboteurAction.Response.ActionClass = SaboteurAction.Response.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options: { once?: boolean } = {},
  ) {
    const target = SaboteurAction.Response.Private.actionTypes.includes(
      actionType as any,
    )
      ? "private"
      : "public";

    const type = `${target}:${actionType}`;

    const listener = (event: ResponseActionEvent) => {
      callback(event.detail as any);
    };

    // TODO: Add {signal: this.socket.signal}
    this.inTarget.addEventListener(type, listener as any, {
      once: options.once,
    });
    return () => {
      this.inTarget.removeEventListener(type, listener as any);
    };
  }

  onAny(
    callback: (action: SaboteurAction.Response.Actions) => void,
    options: { once?: boolean } = {},
  ) {
    const listener = (event: ResponseActionEvent) => {
      callback(event.detail as any);
    };

    this.inTarget.addEventListener("any", listener as any, {
      once: options.once,
    });
    return () => {
      this.inTarget.removeEventListener("any", listener as any);
    };
  }

  onOutgoing<
    TSaboteurActionType extends SaboteurAction.Request.ActionType,
    TSaboteurActionClass extends
      SaboteurAction.Request.ActionClass = SaboteurAction.Request.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options: { once?: boolean } = {},
  ) {
    const listener = (event: RequestActionEvent) => {
      const { action } = event.detail;
      if (action.type !== actionType) return;

      callback(action as any);
    };

    this.outTarget.addEventListener("any", listener as any, {
      once: options.once,
    });
    return () => {
      this.outTarget.removeEventListener("any", listener as any);
    };
  }
}
