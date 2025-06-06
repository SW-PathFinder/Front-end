import { UnsubscribeCallback } from "@/libs/socket-io";

import { GameRoomPlayer } from "./gameRoom";

export interface GameSessionPlayer extends GameRoomPlayer {}

export interface GameSession {
  // /**
  //  * @description 게임 세션의 고유 식별자
  //  * @deprecated can we need this?
  //  */
  // id: string;

  readonly players: GameSessionPlayer[];
}

export interface GameSessionAdapter extends EventTarget {
  onGameSessionEnd(
    callback: (gameSession: GameSession) => void,
  ): UnsubscribeCallback;
}
