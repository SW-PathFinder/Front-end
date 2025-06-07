import { GameSessionAdapter } from "@/libs/gameSession";
import { SaboteurSession } from "@/libs/saboteur/game";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { SaboteurAction } from "./action";

export interface SaboteurSessionAdapter extends GameSessionAdapter {
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
    gameSession: SaboteurSession,
  ): void;

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
  ): UnsubscribeCallback;

  /** @todo add callback argument */
  onGameSessionEnd(
    // callback: (gameSession: SaboteurSession) => void,
    callback: () => void,
  ): UnsubscribeCallback;
}
