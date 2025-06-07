/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";

import { HSSaboteurSocket, SocketAction } from "./socket";

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: MySaboteurPlayer;

  constructor(
    socket: HSSaboteurSocket,
    roomId: string,
    player: MySaboteurPlayer,
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = player;
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

  onGameStateChange<
    TActionType extends SaboteurAction.Response.ActionType,
    TActionClass extends
      SaboteurAction.Response.ActionClass = SaboteurAction.Response.ActionClass & {
      type: TActionType;
    },
  >(
    actionType: TActionType,
    callback: (action: InstanceType<TActionClass>) => void,
    gameSession: SaboteurSession,
  ) {
    const ev = SaboteurAction.Response.Private.actionTypes.includes(
      actionType as any,
    )
      ? "private_game_update"
      : "game_update";

    const listener = (data: SocketAction.Response.Actions) => {
      const action =
        SocketAction.AbstractResponse.fromPrimitive(data).toSaboteurAction(
          gameSession,
        );
      if (action.type !== actionType) return;

      callback(action as any);
    };

    this.socket.on(ev, listener as any);
    return () => {
      this.socket.off(ev, listener as any);
    };
  }

  onGameSessionEnd(callback: () => void): () => void {
    const listener = ({ type, data }: SocketAction.Response.Actions) => {
      if (type !== "game_end") return;
      // TODO: Handle game end logic
      // callback(data.rank);
    };

    this.socket.on("game_update", listener as any);
    return () => {
      this.socket.off("game_update", listener as any);
    };
  }
}
