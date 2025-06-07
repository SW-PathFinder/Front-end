/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameRoomPlayer } from "@/libs/gameSession";
import { SaboteurRoomAdapter, SaboteurSession } from "@/libs/saboteur/game";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
  OtherSaboteurPlayer,
} from "@/libs/saboteur/player";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { HSSaboteurSessionAdapter } from "./gameSession";
import { HSSaboteurSocket, ListenEvents, SocketAction } from "./socket";

export class HSSaboteurRoomAdapter implements SaboteurRoomAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: GameRoomPlayer;

  private gameSession: SaboteurSession | null = null;

  constructor(socket: HSSaboteurSocket, roomId: string, playerId: string) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = { id: playerId, name: playerId };
  }

  onPlayerJoin(callback: (player: GameRoomPlayer) => void) {
    const listener = (data: ListenEvents["player_joined"]) => {
      callback({ id: data.player, name: data.player });
    };

    this.socket.on("player_joined", listener);
    return () => {
      this.socket.off("player_joined", listener);
    };
  }

  onPlayerLeave(callback: (player: GameRoomPlayer) => void) {
    const listener = (data: ListenEvents["player_left"]) => {
      callback({ id: data.player, name: data.player });
    };

    this.socket.on("player_left", listener);
    return () => {
      this.socket.off("player_left", listener);
    };
  }

  leaveRoom() {
    this.socket.emit("leave_room", {
      room: this.roomId,
      player: this.player.id,
    });
  }

  onGameSessionReady(
    callback: (remainSecond: number) => void,
  ): UnsubscribeCallback {
    // const listener = (data: ListenEvents["countdown_started"]) => {
    const listener = (data: ListenEvents["countdown_started"]) => {
      callback(data.seconds);
    };

    this.socket.on("countdown_started", listener);
    return () => {
      this.socket.off("countdown_started", listener);
    };
  }

  onGameSessionStart(callback: (gameSession: SaboteurSession) => void) {
    // Implementation for handling game session start events
    const listener = async ({ type, data }: SocketAction.Response.Actions) => {
      if (type !== "game_started") return;

      const myPlayer = new MySaboteurPlayer({ id: this.player.id });
      const players: AbstractSaboteurPlayer[] = data.players.map((playerId) => {
        if (playerId === this.player.id) return myPlayer;
        return new OtherSaboteurPlayer({ id: playerId });
      });

      const adapter = new HSSaboteurSessionAdapter(
        this.socket,
        this.roomId,
        myPlayer,
      );
      const session = new SaboteurSession(adapter, { players });

      this.gameSession = session;

      callback(session);
    };

    this.socket.on("game_update", listener as any);

    return () => {
      this.socket.off("game_update", listener as any);
    };
  }

  getGameSession(): SaboteurSession | null {
    return this.gameSession;
  }
}
