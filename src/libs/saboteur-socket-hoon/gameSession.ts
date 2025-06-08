/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { HSSaboteurSocket, SocketAction } from "./socket";

type RequestActionEvent = CustomEvent<{
  action: SaboteurAction.Request.Actions;
  primitive: SocketAction.Request.Actions;
}>;
type ResponseActionEvent = CustomEvent<{
  action: SaboteurAction.Response.Actions;
  primitive: SocketAction.Response.Actions;
}>;

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

      const primitive = SocketAction.AbstractResponse.fromPrimitive(data);

      const actions =
        SocketAction.AbstractResponse.fromPrimitive(data).toSaboteurAction();

      for (const action of actions) {
        this.inTarget.dispatchEvent(
          new CustomEvent("any", { detail: { action, primitive } }),
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

  onAny(
    callback: (action: SaboteurAction.Response.Actions) => void,
    options: { once?: boolean } = {},
  ) {
    const listener = (event: ResponseActionEvent) => {
      callback(event.detail.action as any);
    };

    this.inTarget.addEventListener("any", listener as any, {
      once: options.once,
    });
    return () => {
      this.inTarget.removeEventListener("any", listener as any);
    };
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
    return this.onAny((action) => {
      if (action.type !== actionType) return;
      callback(action as any);
    }, options);
  }

  onAnyOutgoing(
    callback: (action: SaboteurAction.Request.Actions) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback {
    const listener = (event: RequestActionEvent) => {
      callback(event.detail.action);
    };

    this.outTarget.addEventListener("any", listener as any, {
      once: options?.once,
    });
    return () => {
      this.outTarget.removeEventListener("any", listener as any);
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
    return this.onAnyOutgoing((action) => {
      if (action.type !== actionType) return;
      callback(action as any);
    }, options);
  }
}
