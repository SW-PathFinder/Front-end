import {
  GameRoomPlayer,
  GameRoom,
  GameRoomAdapter,
  GameSession,
} from "@/libs/gameSession";
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { GameBoard } from "@/libs/saboteur/board";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
} from "@/libs/saboteur/player";
import { UnsubscribeCallback } from "@/libs/socket-io";

// export const BOARD_ROWS = 23;
// export const BOARD_COLS = 23;

export interface SaboteurRoomAdapter extends GameRoomAdapter {
  onGameSessionStart(
    callback: (gameSession: SaboteurSession) => void,
  ): UnsubscribeCallback;
}

export interface SaboteurRoomOption {
  id: string;
  players: GameRoomPlayer[];
  host: GameRoomPlayer;
  capacity: number;
  isPublic: boolean;
  cardHelper: boolean;
}

export class SaboteurRoom implements GameRoom {
  readonly id: string;
  readonly adapter: SaboteurRoomAdapter;
  readonly players: GameRoomPlayer[];

  private _host: GameRoomPlayer;
  readonly capacity: number;
  readonly isPublic: boolean;
  readonly cardHelper: boolean;

  constructor(
    adapter: SaboteurRoomAdapter,
    { id, players, host, capacity, isPublic, cardHelper }: SaboteurRoomOption,
  ) {
    this.adapter = adapter;
    this.id = id;
    this.players = players;
    this._host = host;
    this.capacity = capacity;
    this.isPublic = isPublic;
    this.cardHelper = cardHelper;

    this.adapter.onPlayerJoin((player) => {
      this.players.push(player);
    });
    this.adapter.onPlayerLeave((player) => {
      const index = this.players.findIndex((p) => p.id === player.id);
      if (index !== -1) this.players.splice(index, 1);
    });
  }

  get host(): GameRoomPlayer {
    return this._host;
  }

  // getGameSession(): SaboteurSession | null {
  //   return this.adapter.getGameSession();
  // }
}

export interface SaboteurSessionOptions {
  players: AbstractSaboteurPlayer[];
  firstPlayerIndex: number;
}

export class SaboteurSession implements GameSession {
  private readonly adapter: SaboteurSessionAdapter;

  round: number;
  // turn: number = 0;
  readonly players: AbstractSaboteurPlayer[];
  readonly board: GameBoard;
  private _currentPlayerIndex: number = 0;

  constructor(
    adapter: SaboteurSessionAdapter,
    { players, firstPlayerIndex }: SaboteurSessionOptions,
  ) {
    this.adapter = adapter;
    this.players = players;
    this._currentPlayerIndex = firstPlayerIndex;
    this.round = 1;
    this.board = new GameBoard();
  }

  get currentPlayer(): AbstractSaboteurPlayer {
    return this.players[this._currentPlayerIndex];
  }

  get myPlayer(): MySaboteurPlayer {
    const myPlayer = this.players.find(
      (player) => player instanceof MySaboteurPlayer,
    );
    if (!myPlayer) {
      throw new Error("MyPlayer not found in the game state.");
    }

    return myPlayer;
  }

  // TODO: 소켓 연동
  get remainingCards(): number {
    return 6;
  }
}
