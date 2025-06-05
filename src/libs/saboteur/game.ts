import { GamePlayer, GameRoom, GameSession } from "@/libs/gameSession";
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { GameBoard } from "@/libs/saboteur/board";
import { AbstractPlayer, MyPlayer } from "@/libs/saboteur/player";

// export const BOARD_ROWS = 23;
// export const BOARD_COLS = 23;

export class SaboteurRoom implements GameRoom {
  // state: SaboteurSession | null = null;
  // adapter: SaboteurSessionAdapter;
  // constructor(adapter: SaboteurSessionAdapter) {
  //   this.adapter = adapter;
  // }
  // onPlayerJoin(callback: (player: GamePlayer) => void): void {
  //   this.adapter.addEventListener(
  //     "playerJoin",
  //     (event: CustomEvent<GamePlayer>) => {
  //       callback(event.detail);
  //     },
  //   );
  // }
}

interface SaboteurSessionOptions {
  adapter: SaboteurSessionAdapter;
  players: AbstractPlayer[];
  firstPlayerIndex: number;
}

export class SaboteurSession implements GameSession {
  private readonly adapter: SaboteurSessionAdapter;

  round: number;
  // turn: number = 0;
  readonly players: AbstractPlayer[];
  readonly board: GameBoard;
  private _currentPlayerIndex: number = 0;

  constructor({ adapter, players, firstPlayerIndex }: SaboteurSessionOptions) {
    this.adapter = adapter;
    this.players = players;
    this._currentPlayerIndex = firstPlayerIndex;
    this.round = 1;
    this.board = new GameBoard();
  }

  get currentPlayer(): AbstractPlayer {
    return this.players[this._currentPlayerIndex];
  }

  get myPlayer(): MyPlayer {
    const myPlayer = this.players.find((player) => player instanceof MyPlayer);
    if (!myPlayer) {
      throw new Error("MyPlayer not found in the game state.");
    }

    return myPlayer;
  }
}
