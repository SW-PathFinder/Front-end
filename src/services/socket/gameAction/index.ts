abstract class AbstractSocketAction<T extends string | object> {
  abstract readonly type: string;
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export namespace SocketAction {
  export abstract class AbstractRequest<
    T extends string | object,
  > extends AbstractSocketAction<T> {
    toRequestData(): string {
      return JSON.stringify({ type: this.type, data: this.data });
    }
  }

  export namespace Request {
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

    export type Actions = InstanceType<
      (typeof SocketAction.Request)[keyof typeof SocketAction.Request]
    >;
  }

  export abstract class AbstractResponse<
    T extends string | object,
  > extends AbstractSocketAction<T> {
    abstract readonly target: "all" | (string & {});

    static fromResponseData<T extends string | object>(
      type: string,
      data: T,
      target: string,
    ): AbstractResponse<T> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new responseMap[type](data as any, target) as AbstractResponse<T>;
    }
  }

  export namespace Response {
    abstract class AbstractBroadcastResponse<
      T extends string | object,
    > extends AbstractResponse<T> {
      target = "all" as const;
    }

    export namespace Broadcast {
      export class TurnChange extends AbstractBroadcastResponse<string> {
        type = "turnChange" as const;
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

      export class FoundRock extends AbstractBroadcastResponse<
        [x: number, y: number]
      > {
        type = "rock_found" as const;
      }

      export class RoundEnd extends AbstractBroadcastResponse<{
        winner: "worker" | "saboteur";
        roles: { [playerId: string]: "worker" | "saboteur" };
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

    abstract class AbstractPrivateResponse<
      T extends string | object,
    > extends AbstractResponse<T> {
      target: string;

      constructor(data: T, target: string) {
        super(data);
        this.target = target;
      }
    }

    export namespace Private {
      export class DrawCard extends AbstractPrivateResponse<{ card: number }> {
        type = "drawCard" as const;
      }

      export class MapResult extends AbstractPrivateResponse<{
        cardType: "gold" | "rock";
      }> {
        type = "viewMap" as const;
      }

      export class DiscardCard extends AbstractPrivateResponse<{
        handNum: number;
      }> {
        type = "discard" as const;
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
  }

  type ToUnion<T> = T[keyof T];
  const responseMap = [
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
