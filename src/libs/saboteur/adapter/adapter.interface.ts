import { GameSessionAdapter } from "@/libs/gameSession";
import { SaboteurSession } from "@/libs/saboteur/game";
import { UnsubscribeCallback } from "@/libs/socket-io";

type RequestActionType =
  | "dig"
  | "destroy"
  | "repair"
  | "sabotage"
  | "useMap"
  | "discard"
  | "rotate";

type PublicResponseActionType =
  | "roundStart"
  | "dig"
  | "destroy"
  | "repair"
  | "sabotage"
  | "useMap"
  | "discard"
  | "foundRock"
  | "turnChange"
  | "roundEnd";

type PrivateResponseActionType =
  | "roundStart"
  | "draw"
  | "revealDest"
  | "rotate"
  | "roundEnd";

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

  sendAction(action: {}): void;
  onGameStateChange(
    actionType: PublicResponseActionType | PrivateResponseActionType,
    callback: (gameState: {}) => void,
  ): void;

  /** @todo add callback argument */
  onGameSessionEnd(
    callback: (gameSession: SaboteurSession) => void,
  ): UnsubscribeCallback;
}
