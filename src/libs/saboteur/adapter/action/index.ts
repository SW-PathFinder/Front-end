import { SaboteurCard } from "../../cards";
import { SaboteurSession } from "../../game";
import { AbstractSaboteurPlayer, OtherSaboteurPlayer } from "../../player";
import { PlayerRole, Tools } from "../../types";

interface UpdateAction {
  _isUpdate: true;
  update(gameSession: SaboteurSession): void;
}

interface FailableAction {
  _isFailable: true;

  /**
   * 액션이 확정되었으므로 상태를 업데이트하는 코드를 적는 등의 활용 가능
   */
  onSuccess(gameSession: SaboteurSession): void;

  /**
   * 실패했을 떄 revert하는 등으로 활용 가능
   */
  onFail(gameSession: SaboteurSession): void;
}

interface ConsumeCardAction {
  _isConsumeCard: true;
}

abstract class AbstractAction<T = unknown> {
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  get type(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.constructor as any).type;
  }

  isUpdateAction(): this is UpdateAction {
    return "_isUpdate" in this && !!this._isUpdate;
  }

  isFailableAction(): this is FailableAction {
    return "_isFailable" in this && !!this._isFailable;
  }

  isConsumeCardAction(): this is ConsumeCardAction {
    return "_isConsumeCard" in this && !!this._isConsumeCard;
  }
}

export namespace SaboteurAction {
  export namespace Request {
    export abstract class Primitive<T> extends AbstractAction<T> {
      readonly eventType = "request";

      constructor(data: T) {
        super(data);
      }
    }

    export class Path
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractCommon;
      }>
      implements ConsumeCardAction
    {
      static readonly type = "path";

      readonly _isConsumeCard = true as const;
    }

    export class Destroy
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Destroy;
      }>
      implements ConsumeCardAction
    {
      static readonly type = "destroy";

      readonly _isConsumeCard = true as const;
    }

    export class Repair
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Repair;
        tool: Tools;
      }>
      implements ConsumeCardAction
    {
      static readonly type = "repair";

      readonly _isConsumeCard = true as const;
    }

    export class Sabotage
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Sabotage;
      }>
      implements ConsumeCardAction
    {
      static readonly type = "sabotage";

      readonly _isConsumeCard = true as const;
    }

    export class UseMap
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Map;
      }>
      implements ConsumeCardAction
    {
      static readonly type = "useMap";

      readonly _isConsumeCard = true as const;
    }

    export class Discard
      extends Request.Primitive<{ card: SaboteurCard.Abstract.Playable }>
      implements ConsumeCardAction
    {
      static readonly type = "discard";

      readonly _isConsumeCard = true as const;
    }

    export class Rotate extends Request.Primitive<{
      card: SaboteurCard.Path.AbstractCommon;
    }> {
      // implements UpdateAction
      static readonly type = "rotate";

      // readonly _isUpdate = true as const;
      // update(): void {
      //   const { card } = this.data;
      //   card.flipped = !card.flipped;
      // }
    }

    export type ActionClass =
      | typeof Path
      | typeof Destroy
      | typeof Repair
      | typeof Sabotage
      | typeof UseMap
      | typeof Discard
      | typeof Rotate;
    export type Actions = InstanceType<ActionClass>;
    export type ActionType = ActionClass["type"];
  }

  export namespace Response {
    export abstract class Primitive<T> extends AbstractAction<T> {
      readonly eventType = "response";
    }

    export namespace Public {
      export class Path
        extends Response.Primitive<{
          handNum: number;
          x: number;
          y: number;
          card: SaboteurCard.Path.AbstractCommon;
        }>
        implements UpdateAction
      {
        static readonly type = "path";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { x, y, card, handNum } = this.data;
          gameSession.board.placeCard(x, y, card);
          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class Destroy
        extends Response.Primitive<{ handNum: number; x: number; y: number }>
        implements UpdateAction
      {
        static readonly type = "destroy";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { x, y, handNum } = this.data;
          gameSession.board.removeCard(x, y);
          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class Repair
        extends Response.Primitive<{
          handNum: number;
          tool: Tools;
          playerId: string;
        }>
        implements UpdateAction
      {
        static readonly type = "repair";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { tool, playerId, handNum } = this.data;

          const player = gameSession.players.find((p) => p.id === playerId);
          if (!player) throw new Error(`Player with ID ${playerId} not found.`);

          player.repair(tool);
          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class Sabotage
        extends Response.Primitive<{
          handNum: number;
          tool: Tools;
          playerId: string;
        }>
        implements UpdateAction
      {
        static readonly type = "sabotage";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { tool, playerId, handNum } = this.data;

          const player = gameSession.players.find((p) => p.id === playerId);
          if (!player) throw new Error(`Player with ID ${playerId} not found.`);
          player.sabotage(tool);

          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class UseMap
        extends Response.Primitive<{ handNum: number; x: number; y: number }>
        implements UpdateAction
      {
        static readonly type = "useMap";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { handNum } = this.data;
          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class Discard
        extends Response.Primitive<{ handNum: number }>
        implements UpdateAction
      {
        static readonly type = "discard";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { handNum } = this.data;
          if (gameSession.currentPlayer.isMe()) {
            // 이미 뽑을때 덱에서 지워지기 때문에 덱에 뭔 짓을 더 할 필요는 없음
            gameSession.currentPlayer.removeByIndex(handNum);
          } else if (gameSession.currentPlayer instanceof OtherSaboteurPlayer) {
            if (gameSession.remainingCards > 0) {
              gameSession.cardPool.decreaseRemainingCard(1);
            } else if (gameSession.currentPlayer.handCount > 0) {
              gameSession.currentPlayer.handCount -= 1;
            }
          }
        }
      }

      export class RevealDestination
        extends Response.Primitive<{
          x: number;
          y: number;
          card: SaboteurCard.Path.AbstractDest;
        }>
        implements UpdateAction
      {
        static readonly type = "revealDestination";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { x, y, card } = this.data;

          // Place the rock card on the board
          gameSession.board.revealDestination(x, y, card);
        }
      }

      export class GameStart extends Response.Primitive<{
        // players: AbstractSaboteurPlayer[];
        // myPlayer: MySaboteurPlayer;
        playerIds: string[];
      }> {
        static readonly type = "gameStart";
      }

      export class TurnChange
        extends Response.Primitive<{ playerId: string }>
        implements UpdateAction
      {
        static readonly type = "turnChange";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { playerId } = this.data;

          const nextPlayerIndex = gameSession.players.findIndex(
            (p) => p.id === playerId,
          );
          if (nextPlayerIndex === -1) {
            throw new Error(`Player ${playerId} not found in the game state.`);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (gameSession as any)._currentPlayerIndex = nextPlayerIndex;
        }
      }

      export class RoundEnd extends Response.Primitive<{
        winner: PlayerRole;
        roles: { [playerId: string]: PlayerRole };
      }> {
        static readonly type = "roundEnd";
      }

      export class GameEnd
        extends Response.Primitive<{ golds: { [playerId: string]: number } }>
        implements UpdateAction
      {
        static readonly type = "gameEnd";

        readonly _isUpdate = true as const;
        update(): void {
          // TODO: Implement game end logic
          // const { golds } = this.data;
          // // cleanup game session?
          // gameSession.players.forEach((player) => {
          //   const playerRank = rank.find((r) => r.player.id === player.id);
          //   if (playerRank) {
          //     player.gold += playerRank.gold;
          //   }
          // });
        }
      }

      export type ActionClass =
        | typeof Path
        | typeof Destroy
        | typeof Repair
        | typeof Sabotage
        | typeof UseMap
        | typeof Discard
        | typeof RevealDestination
        | typeof GameStart
        | typeof TurnChange
        | typeof RoundEnd
        | typeof GameEnd;
      export type Actions = InstanceType<ActionClass>;
      export type ActionType = ActionClass["type"];
    }

    export namespace Private {
      export class RoundStart
        extends Response.Primitive<{ round: number; role: PlayerRole }>
        implements UpdateAction
      {
        static readonly type = "roundStart";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          gameSession.resetRoundState(this.data);
        }
      }

      export class Draw
        extends Response.Primitive<{ card: SaboteurCard.Abstract.Playable }>
        implements UpdateAction
      {
        static readonly type = "draw";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { card } = this.data;
          // const cardInDeck = gameSession.cardPool.removeByKind(card);
          // if (!cardInDeck) {
          //   // // eslint-disable-next-line no-debugger
          //   // debugger;
          //   throw new Error(
          //     `Card ${this.data.card.type} not found in the deck for draw.`,
          //   );
          // }
          gameSession.cardPool.decreaseRemainingCard(1);
          gameSession.myPlayer.append(card);
        }
      }

      export class PeekDestination
        extends Response.Primitive<{
          x: number;
          y: number;
          card: SaboteurCard.Path.AbstractDest;
        }>
        implements UpdateAction
      {
        static readonly type = "peekDestination";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
          const { x, y, card } = this.data;

          card.peeked = true;
          gameSession.board.revealDestination(x, y, card);
        }
      }

      export class Rotate
        extends Response.Primitive<{ handNum: number }>
        implements UpdateAction
      {
        static readonly type = "rotate";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { handNum } = this.data;
          const card = gameSession.myPlayer.hands[handNum];
          if (card instanceof SaboteurCard.Path.AbstractCommon) {
            card.flipped = !card.flipped;
          }
        }
      }

      export class PlayerState
        extends Response.Primitive<{
          round: number;
          cardUsed: SaboteurCard.Abstract.Playable[];
          myPlayer: {
            gold: number;
            role: PlayerRole | null;
            hands: SaboteurCard.Abstract.Playable[];
          };
          players: {
            id: string;
            handCount: number;
            status: Record<Tools, boolean>;
          }[];
          currentPlayerId: string;
          deckCount: number;
          board: { x: number; y: number; card: SaboteurCard.Path.Abstract }[];
        }>
        implements UpdateAction
      {
        static readonly type = "playerState";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          gameSession.sync(this.data);
        }
      }

      export class ReceiveGold
        extends Response.Primitive<{ gold: number }>
        implements UpdateAction
      {
        static readonly type = "receiveGold";

        readonly _isUpdate = true as const;
        update(gameSession: SaboteurSession): void {
          const { gold } = this.data;
          gameSession.myPlayer.lastRoundGold = gold;
        }
      }

      export class Exception extends Response.Primitive<{ message: string }> {
        static readonly type = "exception";

        // update(gameSession: SaboteurSession): void {
        //   // throw new Error("Method not implemented.");
        // }
      }

      export type ActionClass =
        | typeof RoundStart
        | typeof Draw
        | typeof PeekDestination
        | typeof Rotate
        | typeof PlayerState
        | typeof ReceiveGold
        | typeof Exception;
      export type Actions = InstanceType<ActionClass>;
      export type ActionType = ActionClass["type"];
      export const actionTypes = Object.values(Private)
        .filter((v) => "prototype" in v)
        .map((value) => value.type) as ActionType[];
    }

    export type ActionClass = Public.ActionClass | Private.ActionClass;
    export type Actions = InstanceType<ActionClass>;
    export type ActionType = ActionClass["type"];
  }

  export type ActionClass = Request.ActionClass | Response.ActionClass;
  export type Actions = InstanceType<ActionClass>;
  export type ActionType = ActionClass["type"];
}
