import { GameBoard } from "@/libs/saboteur/board";
import { AbstractPlayer } from "@/libs/saboteur/player";

interface GameOptions {
  round?: number;
  players?: AbstractPlayer[];

  turn?: number;
  board?: GameBoard;
}

export const BOARD_ROWS = 23;
export const BOARD_COLS = 23;

export class GameState {
  round: number;
  turn: number = 0;
  readonly players: AbstractPlayer[];
  readonly board: GameBoard;
  private _currentPlayerIndex: number = 0;

  constructor({ round = 1, players = [] }: GameOptions = {}) {
    this.round = round;
    this.players = players;
    this.board = new GameBoard();
  }

  get currentPlayer(): AbstractPlayer {
    return this.players[this._currentPlayerIndex];
  }
}
