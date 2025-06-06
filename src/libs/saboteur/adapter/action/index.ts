import { SocketAction } from "@/libs/saboteur-socket-hoon";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { AbstractSaboteurPlayer } from "@/libs/saboteur/player";
import { PlayerRole } from "@/libs/saboteur/types";

abstract class Action<T = unknown, R = void> {
  abstract readonly type: string;
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export namespace SaboteurAction {
  export namespace Request {
    export abstract class Primitive<T> extends Action<T> {
      readonly eventType = "request";

      abstract toSocketPrimitive(): SocketAction.Request.Primitive;
    }

    export class Path extends Request.Primitive<{
      x: number;
      y: number;
      card: SaboteurCard.Path.AbstractCommon;
    }> {
      readonly type = "path";
    }

    export class Destroy extends Request.Primitive<{
      x: number;
      y: number;
      card: SaboteurCard.Action.Destroy;
    }> {
      readonly type = "destroy";
    }

    export class Repair extends Request.Primitive<{
      card: SaboteurCard.Action.Repair;
      player: AbstractSaboteurPlayer;
    }> {
      readonly type = "repair";
    }

    export class Sabotage extends Request.Primitive<{
      card: SaboteurCard.Action.Sabotage;
      player: AbstractSaboteurPlayer;
    }> {
      readonly type = "sabotage";
    }

    export class UseMap extends Request.Primitive<{
      x: number;
      y: number;
      card: SaboteurCard.Action.Map;
    }> {
      readonly type = "useMap";
    }

    export class Discard extends Request.Primitive<{
      card: SaboteurCard.Abstract.Playable;
    }> {
      readonly type = "discard";
    }

    export class Rotate extends Request.Primitive<{
      card: SaboteurCard.Path.AbstractCommon;
    }> {
      readonly type = "rotate";
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

      export class TurnChange extends Response.Primitive<{
        player: AbstractSaboteurPlayer;
      }> {
        readonly type = "turnChange";
      }

      export type Actions =
        | Path
        | Destroy
        | Repair
        | Sabotage
        | UseMap
        | Discard
        | FoundRock
        | TurnChange;
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
        readonly type = "revealDest";
      }

      export class Rotate extends Response.Primitive<{
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        readonly type = "rotate";
      }

      export class RoundEnd extends Response.Primitive<{
        winner: AbstractSaboteurPlayer[];
        round: number;
      }> {
        readonly type = "roundEnd";
      }

      export type Actions = RoundStart | Draw | RevealDest | Rotate | RoundEnd;
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
