import { UnsubscribeCallback } from "@/libs/socket-io";

export interface GamePlayer {
  id: string;
  name: string;
}

/**
 * adapter를 밖
 */
export interface GameRoom {
  getGameSession(): GameSession | null;
}

export interface GameRoomAdapter {
  onPlayerJoin(callback: (player: GamePlayer) => void): UnsubscribeCallback;
  onPlayerLeave(callback: (player: GamePlayer) => void): UnsubscribeCallback;

  leaveRoom(): void;

  onGameSessionReady(callback: () => void): UnsubscribeCallback;

  onGameSessionStart(
    callback: (gameSession: GameSession) => void,
  ): UnsubscribeCallback;

  // createGameSession(): GameSession | null;
}

export interface GameSession {
  // /**
  //  * @description 게임 세션의 고유 식별자
  //  * @deprecated can we need this?
  //  */
  // id: string;

  players: GamePlayer[];
}

export interface GameSessionAdapter extends EventTarget {
  // onGameSessionEnd(
  //   callback: (gameSession: GameSession) => void,
  // ): UnsubscribeCallback;
}
