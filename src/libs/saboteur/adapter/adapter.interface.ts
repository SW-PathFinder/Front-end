import { GameSessionAdapter } from "@/libs/gameSession";
import { SaboteurSession } from "@/libs/saboteur/game";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { SaboteurAction } from "./action";

export interface SaboteurSessionAdapter
  extends EventTarget,
    GameSessionAdapter {
  // getBoard(): GameBoard;
  // getMyPlayer(): MyPlayer;
  // getPlayers(): AbstractPlayer[];
  // getHands(): AbstractCard.Playable[];

  // getGameState(): {
  //   round: number;
  //   players: AbstractPlayer[];
  //   board: GameBoard;
  //   currentPlayerIndex: number;
  // };

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
  ): void;

  onGameStateChange<
    TActionType extends SaboteurAction.Response.Actions["type"],
  >(
    actionType: TActionType,
    callback: (
      action: SaboteurAction.Response.Actions & { type: TActionType },
    ) => void,
  ): void;

  /** @todo add callback argument */
  onGameSessionEnd(
    // callback: (gameSession: SaboteurSession) => void,
    callback: () => void,
  ): UnsubscribeCallback;
}
