import { SocketAction } from "@/libs/saboteur-socket-hoon";
import { GameBoard } from "@/libs/saboteur/board";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { SaboteurSession } from "@/libs/saboteur/game";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
} from "@/libs/saboteur/player";
import { PlayerRole } from "@/libs/saboteur/types";

abstract class Action<T = unknown> {
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  get type(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.constructor as any).type;
  }
}

export namespace SaboteurAction {
  export namespace Request {
    interface SocketTransformable {
      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions;
    }

    export abstract class Primitive<T> extends Action<T> {
      readonly eventType = "request";

      protected getHandNumOfCard(
        myPlayer: MySaboteurPlayer,
        card: SaboteurCard.Abstract,
      ) {
        return myPlayer.hands.findIndex((c) => c.id === card.id);
      }
    }

    export class Path
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractCommon;
      }>
      implements SocketTransformable
    {
      static readonly type = "path";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.PlacePath({
          x: this.data.x,
          y: this.data.y,
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class Destroy
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Destroy;
      }>
      implements SocketTransformable
    {
      static readonly type = "destroy";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.DestroyPath({
          x: this.data.x,
          y: this.data.y,
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class Repair
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Repair;
      }>
      implements SocketTransformable
    {
      static readonly type = "repair";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.Repair({
          target: this.data.player.id,
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class Sabotage
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Sabotage;
      }>
      implements SocketTransformable
    {
      static readonly type = "sabotage";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.Sabotage({
          target: this.data.player.id,
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class UseMap
      extends Request.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Map;
      }>
      implements SocketTransformable
    {
      static readonly type = "useMap";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.UseMap({
          x: this.data.x,
          y: this.data.y,
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class Discard
      extends Request.Primitive<{ card: SaboteurCard.Abstract.Playable }>
      implements SocketTransformable
    {
      static readonly type = "discard";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.Discard({
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export class Rotate
      extends Request.Primitive<{ card: SaboteurCard.Path.AbstractCommon }>
      implements SocketTransformable
    {
      static readonly type = "rotate";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.RotatePath({
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
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
    export type ActionType = Actions["type"];
  }

  export namespace Response {
    export abstract class Primitive<T> extends Action<T> {
      readonly eventType = "response";
    }

    export namespace Public {
      export class Path extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        static readonly type = "path";
      }

      export class Destroy extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Destroy;
      }> {
        static readonly type = "destroy";
      }

      export class Repair extends Response.Primitive<{
        card: SaboteurCard.Action.Repair;
        player: AbstractSaboteurPlayer;
      }> {
        static readonly type = "repair";
      }

      export class Sabotage extends Response.Primitive<{
        card: SaboteurCard.Action.Sabotage;
        player: AbstractSaboteurPlayer;
      }> {
        static readonly type = "sabotage";
      }

      export class UseMap extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Map;
      }> {
        static readonly type = "useMap";
      }

      export class Discard extends Response.Primitive<{
        card: SaboteurCard.Abstract.Playable;
      }> {
        static readonly type = "discard";
      }

      export class FoundRock extends Response.Primitive<{
        x: number;
        y: number;
      }> {
        static readonly type = "foundRock";
      }

      export class GameStart extends Response.Primitive<{
        players: AbstractSaboteurPlayer[];
        myPlayer: MySaboteurPlayer;
      }> {
        static readonly type = "gameStart";
      }

      export class TurnChange extends Response.Primitive<{
        player: AbstractSaboteurPlayer;
      }> {
        static readonly type = "turnChange";
      }

      export class GameEnd extends Response.Primitive<{
        rank: { player: AbstractSaboteurPlayer; gold: number }[];
      }> {
        static readonly type = "gameEnd";
      }

      export type ActionClass =
        | typeof Path
        | typeof Destroy
        | typeof Repair
        | typeof Sabotage
        | typeof UseMap
        | typeof Discard
        | typeof FoundRock
        | typeof GameStart
        | typeof TurnChange
        | typeof GameEnd;
      export type Actions = InstanceType<ActionClass>;
      export type ActionType = ActionClass["type"];
    }

    export namespace Private {
      export class RoundStart extends Response.Primitive<{
        round: number;
        hands: SaboteurCard.Abstract.Playable[];
        role: PlayerRole;
      }> {
        static readonly type = "roundStart";
      }

      export class Draw extends Response.Primitive<{
        card: SaboteurCard.Abstract.Playable;
      }> {
        static readonly type = "draw";
      }

      export class RevealDest extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractDest;
      }> {
        static readonly type = "reveal Dest";
      }

      export class Rotate extends Response.Primitive<{
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        static readonly type = "rotate";
      }

      export class RoundEnd extends Response.Primitive<{
        winners: AbstractSaboteurPlayer[];
      }> {
        static readonly type = "roundEnd";
      }

      export class PlayerState extends Response.Primitive<{
        round: number;
        myPlayer: MySaboteurPlayer;
        currentPlayer: AbstractSaboteurPlayer;
        players: AbstractSaboteurPlayer[];
        board: GameBoard;
      }> {
        static readonly type = "playerState";
      }

      export class ReceiveGold extends Response.Primitive<{
        player: AbstractSaboteurPlayer;
        gold: number;
      }> {
        static readonly type = "receiveGold";
      }

      export type ActionClass =
        | typeof RoundStart
        | typeof Draw
        | typeof RevealDest
        | typeof Rotate
        | typeof RoundEnd
        | typeof PlayerState
        | typeof ReceiveGold;
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
