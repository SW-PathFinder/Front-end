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
import { SaboteurCard } from "@/libs/saboteur/cards";
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

    this.adapter.onAny((action) => {
      action.update(this);
    });

    this.adapter.onOutgoing("path", (reqAction) => {
      const card = reqAction.data.card;

      const cardIndex = this.myPlayer.hands.findIndex((c) => c.id === card.id);
      if (cardIndex === -1) throw new Error("Card not found in my hands.");

      const unsubscribes = [
        this.adapter.on("exception", (resAction) => {
          if (reqAction.requestId !== resAction.requestId) return;
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        }),
        this.adapter.on("path", (resAction) => {
          if (reqAction.requestId !== resAction.requestId) return;
          this.myPlayer.remove(cardIndex);
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        }),
      ];
    });

    this.adapter.onOutgoing("rotate", (reqAction) => {
      const card = reqAction.data.card;
      const originalFlipped = card.flipped;
      card.flipped = !card.flipped;

      const cardIndex = this.myPlayer.hands.findIndex((c) => c.id === card.id);
      if (cardIndex === -1) throw new Error("Card not found in my hands.");

      const unsubscribes = [
        this.adapter.on("exception", (resAction) => {
          if (reqAction.requestId !== resAction.requestId) return;
          unsubscribes.forEach((unsubscribe) => unsubscribe());
          card.flipped = originalFlipped; // Rollback on exception
        }),
        this.adapter.on("rotate", (resAction) => {
          if (reqAction.requestId !== resAction.requestId) return;
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        }),
      ];
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

  // private onRoundStart({ data }: SaboteurAction.Response.Private.RoundStart) {
  //   this.round = data.round;

  //   data.hands.forEach((card) => this.myPlayer.add(card));
  //   this.myPlayer.role = data.role;

  //   this.players.forEach((player) => {
  //     if (player instanceof OtherSaboteurPlayer)
  //       player.handCount = OtherSaboteurPlayer.getInitialHandCount(
  //         this.players.length,
  //       );
  //   });
  // }

  // private onRoundEnd({ data }: SaboteurAction.Response.Private.RoundEnd) {
  //   this.players.forEach((player) => {
  //     player.resetRoundState();
  //   });
  // }
}
export interface SaboteurSession extends Reactive {}
