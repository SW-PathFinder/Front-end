import { UnsubscribeCallback } from "@/libs/socket-io";

import { GameRoomPlayer } from "./gameRoom";

export interface GameSessionPlayer extends GameRoomPlayer {}

export interface GameSession {
  // /**
  //  * @description 게임 세션의 고유 식별자
  //  * @deprecated can we need this?
  //  */
  // id: string;

  readonly players: readonly GameSessionPlayer[];
}

/**
 * @todo Define default action types to support
 */
export interface GameSessionAdapter {
  sendAction(action: object, gameSession: GameSession): void;

  on(
    actionType: string,
    callback: (action: object) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  onAny(
    callback: (action: object) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  onOutgoing(
    actionType: string,
    callback: (action: object) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;
}
