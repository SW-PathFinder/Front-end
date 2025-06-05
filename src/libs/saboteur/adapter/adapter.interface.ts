import { GameSessionAdapter } from "@/libs/gameSession";
import { GameBoard } from "@/libs/saboteur/board";
import { AbstractCard } from "@/libs/saboteur/cards";
import { AbstractPlayer, MyPlayer } from "@/libs/saboteur/player";

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
}
