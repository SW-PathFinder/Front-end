import {
  GameRoomPlayer,
  GameRoom,
  GameRoomAdapter,
  GameSession,
} from "@/libs/gameSession";
import { NonReactive, Reactive, Reactivity } from "@/libs/reactivity";
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { GameBoard } from "@/libs/saboteur/board";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
  OtherSaboteurPlayer,
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

  private _remainSecond: number | null = null;
  private _isReady: boolean = false;

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
    this.adapter.onGameSessionReady((remainSecond) => {
      this._isReady = true;
      this._remainSecond = remainSecond;

      const id = setInterval(() => {
        if (this._remainSecond === null || this._remainSecond <= 0) {
          clearInterval(id);
          return;
        }

        this._remainSecond -= 1;
      }, 1000);
    });
  }

  get host(): GameRoomPlayer {
    return this._host;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get remainSecond(): number | null {
    return this._remainSecond;
  }
}
export interface SaboteurRoom extends Reactive {}

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
  readonly board: GameBoard;
  private _currentPlayerIndex: number = 0;

  constructor(
    adapter: SaboteurSessionAdapter,
    { players }: SaboteurSessionOptions,
  ) {
    this.adapter = adapter;
    this.players = players;
    this.board = new GameBoard();

    this.adapter.onGameStateChange(
      "roundStart",
      (data) => {
        this.onRoundStart(data);
      },
      this,
    );
    this.adapter.onGameStateChange(
      "turnChange",
      (data) => {
        this.onTurnChange(data);
      },
      this,
    );
    this.adapter.onGameStateChange(
      "roundEnd",
      (data) => {
        this.onRoundEnd(data);
      },
      this,
    );
    this.adapter.onGameSessionEnd(() => {
      this.onGameSessionEnd();
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

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
  ): void {
    this.adapter.sendAction(action, this);
  }

  onGameStateChange<
    TActionType extends SaboteurAction.Response.Actions["type"],
  >(
    actionType: TActionType,
    callback: (action: SaboteurAction.Response.Actions) => void,
  ): UnsubscribeCallback {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.adapter.onGameStateChange(actionType as any, callback, this);
  }

  private onRoundStart({ data }: SaboteurAction.Response.Private.RoundStart) {
    this.round = data.round;

    data.hands.forEach((card) => this.myPlayer.add(card));
    this.myPlayer.role = data.role;

    this.players.forEach((player) => {
      if (player instanceof OtherSaboteurPlayer)
        player.handCount = OtherSaboteurPlayer.getInitialHandCount(
          this.players.length,
        );
    });
  }

  private onTurnChange({
    data: { player },
  }: SaboteurAction.Response.Public.TurnChange) {
    const nextPlayerIndex = this.players.findIndex((p) => p.id === player.id);
    if (nextPlayerIndex === -1) {
      throw new Error(`Player ${player.id} not found in the game state.`);
    }
    this._currentPlayerIndex = nextPlayerIndex;
  }

  private onRoundEnd({ data }: SaboteurAction.Response.Private.RoundEnd) {
    this.players.forEach((player) => {
      player.resetRoundState();
    });
  }

  private onGameSessionEnd() {
    throw new Error("Method not implemented.");
  }
}
export interface SaboteurSession extends Reactive {}
