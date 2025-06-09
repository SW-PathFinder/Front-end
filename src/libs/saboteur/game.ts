import {
  GameRoomPlayer,
  GameRoom,
  GameRoomAdapter,
  GameSession,
} from "@/libs/gameSession";
import { Reactivity, NonReactive, ReactiveObject } from "@/libs/reactivity";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { SaboteurSessionAdapter } from "./adapter";
import { SaboteurAction } from "./adapter/action";
import { GameBoard } from "./board";
import { SaboteurCardPool } from "./cards/deck";
import { AbstractSaboteurPlayer, MySaboteurPlayer } from "./player";

export interface SaboteurRoomAdapter extends GameRoomAdapter {
  onGameSessionStart(
    callback: (gameSession: SaboteurSession) => void,
  ): UnsubscribeCallback;

  createGameSession(players: GameRoomPlayer[]): SaboteurSession;
}

export interface SaboteurRoomOption {
  id: string;
  players: GameRoomPlayer[];
  host: GameRoomPlayer;
  capacity: number;
  isPublic: boolean;
  cardHelper: boolean;
  sessionExists?: boolean;
}

@Reactivity()
export class SaboteurRoom implements GameRoom {
  @NonReactive
  readonly adapter: SaboteurRoomAdapter;

  readonly id: string;
  readonly players: GameRoomPlayer[];

  private _host: GameRoomPlayer;
  readonly capacity: number;
  readonly isPublic: boolean;
  readonly cardHelper: boolean;

  private _remainingSecond: number | null = null;
  private _isReady: boolean = false;
  private _gameSession: SaboteurSession | null = null;

  constructor(
    adapter: SaboteurRoomAdapter,
    {
      id,
      players,
      host,
      capacity,
      isPublic,
      cardHelper,
      sessionExists,
    }: SaboteurRoomOption,
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
    this.adapter.onGameSessionReady((remainSecond) => {
      this._isReady = true;
      this._remainingSecond = remainSecond;

      const id = setInterval(() => {
        if (this._remainingSecond === null || this._remainingSecond <= 0) {
          clearInterval(id);
          return;
        }

        this._remainingSecond -= 1;
      }, 1000);
    });

    this.adapter.onGameSessionStart((gameSession) => {
      this._gameSession = gameSession;
    });

    if (sessionExists)
      this._gameSession = this.adapter.createGameSession(this.players);
  }

  get host(): GameRoomPlayer {
    return this._host;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get remainingSecond(): number | null {
    return this._remainingSecond;
  }

  get gameSession(): SaboteurSession | null {
    return this._gameSession;
  }
}
export interface SaboteurRoom extends ReactiveObject {}

export interface SaboteurSessionOptions {
  players: AbstractSaboteurPlayer[];
}

@Reactivity()
export class SaboteurSession implements GameSession {
  @NonReactive
  readonly adapter: SaboteurSessionAdapter;

  round: number = 0;
  // turn: number = 0;
  readonly players: AbstractSaboteurPlayer[];
  readonly board = new GameBoard();
  readonly cardPool = new SaboteurCardPool();

  private _currentPlayerIndex: number = 0;
  private _turnTimeLeft: number;

  constructor(
    adapter: SaboteurSessionAdapter,
    { players }: SaboteurSessionOptions,
  ) {
    this.adapter = adapter;
    this.players = players;

    this.adapter.onAny((action) => {
      console.log("action received:", action);
      if (action.isUpdateAction()) action.update(this);
    });

    this.adapter.onAnyOutgoing((action) => {
      console.log("action sent:", action);
      if (action.isUpdateAction()) action.update(this);
    });

    // turn timer
    this._turnTimeLeft = 0;
    setInterval(() => {
      if (this._turnTimeLeft > 0) this._turnTimeLeft -= 1;
    }, 1000);

    this.adapter.onTurnStart((_, duration) => {
      this._turnTimeLeft = duration;
    });
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

  get turnRemainingSecond(): number {
    return this._turnTimeLeft;
  }

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
  ): void {
    this.adapter.sendAction(action, this);
  }

  sync({
    round,
    myPlayer,
    players,
    currentPlayerId,
    board,
    cardUsed,
  }: SaboteurAction.Response.Private.PlayerState["data"]) {
    this.round = round;

    // sync players
    this.myPlayer.sync(myPlayer);
    this.players.forEach((player) => {
      const playerData = players.find((p) => p.id === player.id);
      if (playerData) player.sync(playerData);
    });
    this._currentPlayerIndex = this.players.findIndex(
      (player) => player.id === currentPlayerId,
    );

    this.board.sync(board);
    this.cardPool.sync(cardUsed, this.players);
  }
}
export interface SaboteurSession extends ReactiveObject {}
