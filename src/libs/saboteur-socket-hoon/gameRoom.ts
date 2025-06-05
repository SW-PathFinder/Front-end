import { GamePlayer, GameRoomAdapter } from "@/libs/gameSession";
import {
  PlayableCardId,
  transformIdToCard,
} from "@/libs/saboteur-socket-hoon/card";
import { HSSaboteurSessionAdapter } from "@/libs/saboteur-socket-hoon/gameSession";
import { SaboteurSession } from "@/libs/saboteur/game";
import { AbstractPlayer, MyPlayer, OtherPlayer } from "@/libs/saboteur/player";
import { onOncePromise, UnsubscribeCallback } from "@/libs/socket-io";

import { HSSaboteurSocket, ListenEvents, SocketAction } from "./socket";

const handSizePerPlayerCountMap: Record<number, number> = {
  3: 6,
  4: 6,
  5: 6,
  6: 5,
  7: 5,
  8: 4,
  9: 4,
  10: 4,
};

export class HSSaboteurRoomAdapter implements GameRoomAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: GamePlayer;

  constructor(socket: HSSaboteurSocket, roomId: string, player: GamePlayer) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = player;
  }

  onPlayerJoin(callback: (player: GamePlayer) => void) {
    const listener = (data: ListenEvents["player_joined"]) => {
      callback({ id: data.player, name: data.player });
    };

    this.socket.on("player_joined", listener);
    return () => {
      this.socket.off("player_joined", listener);
    };
  }

  onPlayerLeave(callback: (player: GamePlayer) => void) {
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

  onGameSessionReady(callback: () => void): UnsubscribeCallback {
    throw new Error("Method not implemented.");
    const listener = (data: ListenEvents["countdown_started"]) => {
      callback();
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

      const playerIds = data.players;
      const maxHandSize = handSizePerPlayerCountMap[playerIds.length];

      const {
        data: { currentRound, hand, role },
      } = await onOncePromise(
        this.socket,
        "game_update",
        SocketAction.isPrimitiveType("roundStart"),
      ).promise;

      const hands = hand.map(({ cardId, reverse }) => {
        return transformIdToCard(
          cardId as PlayableCardId,
          typeof reverse === "boolean" ? reverse : undefined,
        );
      });

      const players: AbstractPlayer[] = playerIds.map((playerId) => {
        if (playerId === this.player.id) {
          return new MyPlayer({ id: playerId, role, hands }); // MyPlayer
        }
        return new OtherPlayer({ id: playerId, handCount: maxHandSize }); // OtherPlayer
      });

      const firstPlayerIndex = players.findIndex(
        (player) => player.id === current_player,
      );

      const adapter = new HSSaboteurSessionAdapter(this.socket);

      const session = new SaboteurSession({
        adapter,
        players,
        firstPlayerIndex,
      });

      callback(session);
    };

    this.socket.on("game_update", listener);

    return () => {
      this.socket.off("game_update", listener);
    };
  }
}
