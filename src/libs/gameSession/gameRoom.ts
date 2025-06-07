import { UnsubscribeCallback } from "@/libs/socket-io";

import { GameSession } from "./gameSession";

export interface GameRoomPlayer {
  id: string;
  name: string;
}

/**
 * adapter를 밖
 */
export interface GameRoom {
  readonly id: string;
  readonly host: GameRoomPlayer;
  readonly players: GameRoomPlayer[];
}

export interface GameRoomAdapter {
  onPlayerJoin(callback: (player: GameRoomPlayer) => void): UnsubscribeCallback;
  onPlayerLeave(
    callback: (player: GameRoomPlayer) => void,
  ): UnsubscribeCallback;

  leaveRoom(): void;

  onGameSessionReady(callback: () => void): UnsubscribeCallback;

  onGameSessionStart(
    callback: (gameSession: GameSession) => void,
  ): UnsubscribeCallback;

  // getGameSession(): GameSession | null;
}
