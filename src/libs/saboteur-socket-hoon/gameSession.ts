/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";

import { HSSaboteurSocket, SocketAction } from "./socket";

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;

  constructor(socket: HSSaboteurSocket) {
    this.socket = socket;
  }

  sendAction<TAction extends SaboteurAction.Request.Actions>(action: TAction) {
    // const room = this.socket.getRoomId();
    // const player = this.socket.getPlayerId();

    this.socket.emit("game_action", {
      room,
      player,
      action: action.toSocketPrimitive(),
    });
  }

  onGameStateChange<
    TActionType extends SaboteurAction.Response.Actions["type"],
  >(
    actionType: TActionType,
    callback: (
      action: SaboteurAction.Response.Actions & { type: TActionType },
    ) => void,
  ) {
    const ev =
      actionType in SaboteurAction.Response.Private.actionTypes
        ? "private_game_update"
        : "game_update";

    const listener = (data: SocketAction.Response.Actions) => {
      if (data.type !== actionType) return;

      const action = SocketAction.AbstractResponse.fromPrimitive(data);
      callback(action.toSaboteurAction() as any);
    };

    this.socket.on(ev, listener as any);
    return () => {
      this.socket.off(ev, listener as any);
    };
  }

  onGameSessionEnd(callback: () => void): () => void {
    const listener = ({ type, data }: SocketAction.Response.Actions) => {
      if (type !== "game_end") return;
      // callback(data.rank);
    };

    this.socket.on("game_update", listener as any);
    return () => {
      this.socket.off("game_update", listener as any);
    };
  }
}
