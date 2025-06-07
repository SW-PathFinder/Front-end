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
  abstract readonly type: string;
  readonly data: T;

  constructor(data: T) {
    this.data = data;
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
      readonly type = "path";

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
      readonly type = "destroy";

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
      readonly type = "repair";

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
      readonly type = "sabotage";

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
      readonly type = "useMap";

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
      readonly type = "discard";

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
      readonly type = "rotate";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.RotatePath({
          handNum: this.getHandNumOfCard(gameSession.myPlayer, this.data.card),
        });
      }
    }

    export type Actions =
      | Path
      | Destroy
      | Repair
      | Sabotage
      | UseMap
      | Discard
      | Rotate;

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
        readonly type = "path";
      }

      export class Destroy extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Destroy;
      }> {
        readonly type = "destroy";
      }

      export class Repair extends Response.Primitive<{
        card: SaboteurCard.Action.Repair;
        player: AbstractSaboteurPlayer;
      }> {
        readonly type = "repair";
      }

      export class Sabotage extends Response.Primitive<{
        card: SaboteurCard.Action.Sabotage;
        player: AbstractSaboteurPlayer;
      }> {
        readonly type = "sabotage";
      }

      export class UseMap extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Action.Map;
      }> {
        readonly type = "useMap";
      }

      export class Discard extends Response.Primitive<{
        card: SaboteurCard.Abstract.Playable;
      }> {
        readonly type = "discard";
      }

      export class FoundRock extends Response.Primitive<{
        x: number;
        y: number;
      }> {
        readonly type = "foundRock";
      }

      export class GameStart extends Response.Primitive<{
        players: AbstractSaboteurPlayer[];
        myPlayer: MySaboteurPlayer;
      }> {
        readonly type = "gameStart";
      }

      export class TurnChange extends Response.Primitive<{
        player: AbstractSaboteurPlayer;
      }> {
        readonly type = "turnChange";
      }

      export class GameEnd extends Response.Primitive<{
        rank: { player: AbstractSaboteurPlayer; gold: number }[];
      }> {
        readonly type = "gameEnd";
      }

      export type Actions =
        | Path
        | Destroy
        | Repair
        | Sabotage
        | UseMap
        | Discard
        | FoundRock
        | GameStart
        | TurnChange
        | GameEnd;
      export type ActionType = Actions["type"];
    }

    export namespace Private {
      export class RoundStart extends Response.Primitive<{
        round: number;
        hands: SaboteurCard.Abstract.Playable[];
        role: PlayerRole;
      }> {
        readonly type = "roundStart";
      }

      export class Draw extends Response.Primitive<{
        card: SaboteurCard.Abstract.Playable;
      }> {
        readonly type = "draw";
      }

      export class RevealDest extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractDest;
      }> {
        readonly type = "reveal Dest";
      }

      export class Rotate extends Response.Primitive<{
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        readonly type = "rotate";
      }

      export class RoundEnd extends Response.Primitive<{
        winners: AbstractSaboteurPlayer[];
      }> {
        readonly type = "roundEnd";
      }

      export class PlayerState extends Response.Primitive<{
        round: number;
        myPlayer: MySaboteurPlayer;
        currentPlayer: AbstractSaboteurPlayer;
        players: AbstractSaboteurPlayer[];
        board: GameBoard;
      }> {
        readonly type = "playerState";
      }

      export class ReceiveGold extends Response.Primitive<{
        player: AbstractSaboteurPlayer;
        gold: number;
      }> {
        readonly type = "receiveGold";
      }

      export type Actions =
        | RoundStart
        | Draw
        | RevealDest
        | Rotate
        | RoundEnd
        | PlayerState
        | ReceiveGold;
      export type ActionType = Actions["type"];
      export const actionTypes = Object.values(Private)
        .filter((v) => "prototype" in v)
        .map((value) => value.prototype.type) as ActionType[];
    }

    export type Actions = Public.Actions | Private.Actions;
    export type ActionType = Actions["type"];
  }

  export type Actions = Request.Actions | Response.Actions;
  export type ActionType = Request.ActionType | Response.ActionType;
}
