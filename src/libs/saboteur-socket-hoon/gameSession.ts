/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";

import { HSSaboteurSocket, SocketAction } from "./socket";

type ResponseActionEvent = CustomEvent<SocketAction.Response.Actions>;
export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: MySaboteurPlayer;

  private readonly eventTarget = new EventTarget();

  constructor(
    socket: HSSaboteurSocket,
    roomId: string,
    player: MySaboteurPlayer,
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = player;

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

        this.eventTarget.dispatchEvent(
          new CustomEvent("any", { detail: action }),
        );
        this.eventTarget.dispatchEvent(
          new CustomEvent(`${target}:${action.type}`, { detail: action }),
        );
      }
    });
  }

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
    gameSession: SaboteurSession,
  ) {
    this.socket.emit("game_action", {
      room: this.roomId,
      player: this.player.id,
      action: action.toSocketAction(gameSession),
    });
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
    this.eventTarget.addEventListener(type, listener as any);
    return () => {
      this.eventTarget.removeEventListener(type, listener as any);
    };
  }

  onAny(callback: (action: SaboteurAction.Response.Actions) => void) {
    const listener = (event: ResponseActionEvent) => {
      callback(event.detail as any);
    };

    this.eventTarget.addEventListener("any", listener as any);
    return () => {
      this.eventTarget.removeEventListener("any", listener as any);
    };
  }
}
