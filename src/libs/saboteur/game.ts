import { PathCard } from "@/libs/saboteur/cards";
import { AbstractPlayer } from "@/libs/saboteur/player";

interface GameOptions {
  round?: number;
  players?: AbstractPlayer[];

  turn?: number;
  board?: (PathCard.Abstract | null)[][];
}

export const BOARD_ROWS = 23;
export const BOARD_COLS = 23;

export class GameState {
  round: number;
  turn: number = 0;
  players: AbstractPlayer[];
  board: (PathCard.Abstract | null)[][];
  private currentPlayerIndex: number = 0;

  constructor({
    round = 1,
    players = [],
    board = Array.from({ length: BOARD_ROWS }, () => {
      return Array.from({ length: BOARD_COLS }, () => null);
    }),
  }: GameOptions) {
    this.round = round;
    this.players = players;
    this.board = board;
  }
}
