import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { PlayerRole } from "@/libs/saboteur/types";

abstract class AbstractSocketAction<T extends string | object = string | object>
  implements SocketAction.Primitive
{
  abstract readonly type: string;
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}

type Prettify<T> = { [K in keyof T]: T[K] };

export namespace SocketAction {
  export interface Primitive {
    type: string;
    data: string | object;
  }
  export abstract class AbstractRequest<
      T extends string | object = string | object,
    >
    extends AbstractSocketAction<T>
    implements Request.Primitive
  {
    toPrimitive(): Request.Primitive {
      return { type: this.type, data: this.data };
    }
  }

  export namespace Request {
    export interface Primitive extends SocketAction.Primitive {}
    export class PlacePath extends AbstractRequest<{
      x: number;
      y: number;
      handNum: number;
    }> {
      type = "path" as const;
    }

    export class DestroyPath extends AbstractRequest<{
      x: number;
      y: number;
      handNum: number;
    }> {
      type = "rockFail" as const;
    }

    export class Sabotage extends AbstractRequest<{
      /**
       * player id
       */
      target: string;
      handNum: number;
    }> {
      type = "sabotage" as const;
    }

    export class Repair extends AbstractRequest<{
      /**
       * player id
       */
      target: string;
      handNum: number;
    }> {
      type = "repair" as const;
    }

    export class UseMap extends AbstractRequest<{
      x: number;
      y: number;
      handNum: number;
    }> {
      type = "viewMap" as const;
    }

    export class Discard extends AbstractRequest<{ handNum: number }> {
      type = "discard" as const;
    }

    export class RotatePath extends AbstractRequest<{ handNum: number }> {
      type = "reversePath" as const;
    }

    export class PlayerState extends AbstractRequest<{}> {
      type = "playerState" as const;
    }

    export type Actions = InstanceType<
      (typeof SocketAction.Request)[keyof typeof SocketAction.Request]
    >;
  }

  export abstract class AbstractResponse<
      T extends string | object = string | object,
    >
    extends AbstractSocketAction<T>
    implements Response.Primitive
  {
    id: number;
    readonly target: "all" | (string & {});

    constructor(data: T, target: "all" | (string & {}), id: number) {
      super(data);
      this.id = id;
      this.target = target;
    }

    static fromPrimitive<T extends Response.Primitive>(
      primitive: T,
    ): AbstractResponse<T["data"]> {
      return new Response.typeToClassMap[primitive.type](
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        primitive.data as any,
        primitive.target,
        primitive.id,
      );
    }

    abstract toSaboteurAction(): SaboteurAction.Response.Actions;
  }

  export namespace Response {
    export interface Primitive extends SocketAction.Primitive {
      id: number;
      // requestId?: string;
      target: "all" | (string & {});
    }

    export abstract class AbstractBroadcastResponse<
        T extends string | object = string | object,
      >
      extends AbstractResponse<T>
      implements Broadcast.Primitive
    {
      target = "all" as const;
    }

    export namespace Broadcast {
      export interface Primitive extends Response.Primitive {
        target: "all" | (string & {});
      }

      export class GameStart extends AbstractBroadcastResponse<{
        /** @description player ids in the game */
        players: string[];
      }> {
        type = "game_started" as const;
      }

      export class TurnChange extends AbstractBroadcastResponse<string> {
        type = "turn_change" as const;
        /** @description next player id */
        declare data;
      }

      export class PlacePath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        type = "path" as const;
      }

      export class DestroyPath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        type = "rockFail" as const;
      }

      export class Sabotage extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: ("pickaxe" | "lantern" | "mineCart")[];
      }> {
        type = "sabotage" as const;
      }

      export class Repair extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: "pickaxe" | "lantern" | "mineCart";
      }> {
        type = "repair" as const;
      }

      export class UseMap extends AbstractBroadcastResponse<{
        target: [x: number, y: number];
      }> {
        type = "viewMap" as const;
      }

      export class DiscardCard extends AbstractBroadcastResponse<{
        handNum: number;
      }> {
        type = "discard" as const;
      }

      export class FoundRock extends AbstractBroadcastResponse<
        [x: number, y: number]
      > {
        type = "rock_found" as const;
      }

      export class RoundEnd extends AbstractBroadcastResponse<{
        winner: PlayerRole;
        roles: { [playerId: string]: PlayerRole };
      }> {
        type = "round_end" as const;
      }

      export class GameEnd extends AbstractBroadcastResponse<{
        rank: [playerId: string, gold: number][];
      }> {
        type = "game_end" as const;
      }

      export type Actions = InstanceType<
        (typeof Response.Broadcast)[keyof typeof Response.Broadcast]
      >;
    }

    export abstract class AbstractPrivateResponse<
        T extends string | object = string | object,
      >
      extends AbstractResponse<T>
      implements Private.Primitive
    {
      readonly target: string;

      constructor(data: T, target: string, id: number) {
        super(data, target, id);
        this.target = target;
      }
    }

    export namespace Private {
      export interface Primitive extends Response.Primitive {
        target: string;
      }

      export class RoundStart extends AbstractPrivateResponse<{
        hand: { cardId: number; reverse?: boolean }[];
        role: PlayerRole;
        currentRound: number;
      }> {
        type = "roundStart" as const;
      }

      export class DrawCard extends AbstractPrivateResponse<{ card: number }> {
        type = "drawCard" as const;
      }

      export class RevealDestination extends AbstractPrivateResponse<{
        cardType: "gold" | "rock";
      }> {
        // TODO: 기존 서버 타입은 viewMap인데 Broadcast의 UseMap과 구분이 불가능해서 바꿈
        type = "revealDest" as const;
      }

      export class RotatePathCard extends AbstractPrivateResponse<{
        card: number;
      }> {
        type = "reversePath" as const;
      }

      export class ReceiveGold extends AbstractPrivateResponse<{
        gold: number;
      }> {
        type = "getGold" as const;
      }

      export class PlayerState extends AbstractPrivateResponse<{
        // round state
        round: number;
        // 내꺼
        gold: number;

        // personal turn state
        hands: { cardId: number; reverse?: boolean }[];

        // global turn state
        currentPlayerId: string;
        board: { x: number; y: number; cardId: number; reverse: boolean }[];
        players: {
          playerId: string;
          tool: { mineCart: boolean; pickaxe: boolean; lantern: boolean };
          handCount: number;
        }[];
      }> {
        type = "playerState" as const;
      }

      export type Actions = InstanceType<
        (typeof Response.Private)[keyof typeof Response.Private]
      >;
    }

    abstract class AbstractErrorResponse extends AbstractPrivateResponse<string> {}

    export namespace Error {
      export class Error extends AbstractErrorResponse {
        type = "error" as const;
      }
      export type Actions = Error;
    }

    export type Actions =
      | Response.Broadcast.Actions
      | Response.Private.Actions
      | Response.Error.Actions;

    type ToUnion<T> = T[keyof T];
    export const typeToClassMap = [
      ...Object.entries(Response.Broadcast),
      ...Object.entries(Response.Private),
      ...Object.entries(Response.Error),
    ].reduce(
      (prev, [, cls]) => {
        prev[cls.prototype.type] = cls;
        return prev;
      },
      {} as Record<
        string,
        ToUnion<
          typeof Response.Broadcast &
            typeof Response.Private &
            typeof Response.Error
        >
      >,
    );
  }

  export type Actions = Request.Actions | Response.Actions;

  export function isType<T extends Actions["type"]>(type: T) {
    return (action: Actions): action is Extract<Actions, { type: T }> => {
      return action.type === type;
    };
  }
  export function isPrimitiveType<T extends Actions["type"]>(type: T) {
    return (
      action: Primitive,
    ): action is Prettify<Extract<Actions, { type: T }>> => {
      return action.type === type;
    };
  }
}
