import { transformIdToCard } from "@/libs/saboteur-socket-hoon/card";
import { FixedArrayGrid2d } from "@/libs/saboteur-socket-hoon/fixedGrid2d";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { PlayerRole, Tools } from "@/libs/saboteur/types";

abstract class AbstractSocketAction<T extends string | object = string | object>
  implements SocketAction.Primitive
{
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  get type(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.constructor as any).type;
  }
}

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
      // TODO: 이거 prototype에 없음
      static readonly type = "path";

      constructor(data: { x: number; y: number; handNum: number }) {
        // 서버에서 받는 좌표 (10,5)에서 10이 y임;;
        const [y, x] = FixedArrayGrid2d.relativeToAbsolute(data.x, data.y);
        super({ x, y, handNum: data.handNum });
      }
    }

    export class DestroyPath extends AbstractRequest<{
      x: number;
      y: number;
      handNum: number;
    }> {
      static readonly type = "rockFail";

      constructor(data: { x: number; y: number; handNum: number }) {
        const [y, x] = FixedArrayGrid2d.relativeToAbsolute(data.x, data.y);
        super({ x, y, handNum: data.handNum });
      }
    }

    export class Sabotage extends AbstractRequest<{
      /**
       * player id
       */
      target: string;
      handNum: number;
    }> {
      static readonly type = "sabotage";
    }

    export class Repair extends AbstractRequest<{
      /**
       * player id
       */
      target: string;
      handNum: number;
    }> {
      static readonly type = "repair";
    }

    export class UseMap extends AbstractRequest<{
      x: number;
      y: number;
      handNum: number;
    }> {
      static readonly type = "viewMap";

      constructor(data: { x: number; y: number; handNum: number }) {
        const [y, x] = FixedArrayGrid2d.relativeToAbsolute(data.x, data.y);
        super({ x, y, handNum: data.handNum });
      }
    }

    export class Discard extends AbstractRequest<{ handNum: number }> {
      static readonly type = "discard";
    }

    export class RotatePath extends AbstractRequest<{ handNum: number }> {
      static readonly type = "reversePath";
    }

    export class PlayerState extends AbstractRequest<{}> {
      static readonly type = "playerState";
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

    abstract toSaboteurAction(): SaboteurAction.Response.Actions[];
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
        static readonly type = "game_started";

        /**
         * @deprecated do not use it
         * only for raw socket response definition
         */
        toSaboteurAction(): [SaboteurAction.Response.Public.GameStart] {
          throw new Error(
            "GameStart action should not be used directly. Use GameSession to handle game start.",
          );
        }
      }

      export class TurnChange extends AbstractBroadcastResponse<string> {
        static readonly type = "turn_change";
        /** @description next player id */
        declare data;

        toSaboteurAction(): [SaboteurAction.Response.Public.TurnChange] {
          return [
            new SaboteurAction.Response.Public.TurnChange({
              playerId: this.data,
            }),
          ];
        }
      }

      export class PlacePath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        static readonly type = "path";

        toSaboteurAction(): [SaboteurAction.Response.Public.Path] {
          const [x, y] = FixedArrayGrid2d.absoluteToRelative(
            this.data.y,
            this.data.x,
          );
          const card = transformIdToCard(
            this.data.card,
          ) as SaboteurCard.Path.AbstractCommon;
          return [new SaboteurAction.Response.Public.Path({ card, x, y })];
        }
      }

      export class DestroyPath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        static readonly type = "rockFail";

        toSaboteurAction(): [SaboteurAction.Response.Public.Destroy] {
          const [x, y] = FixedArrayGrid2d.absoluteToRelative(
            this.data.y,
            this.data.x,
          );
          return [new SaboteurAction.Response.Public.Destroy({ x, y })];
        }
      }

      export class Sabotage extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: Tools;
      }> {
        static readonly type = "sabotage";

        toSaboteurAction(): [SaboteurAction.Response.Public.Sabotage] {
          return [
            new SaboteurAction.Response.Public.Sabotage({
              tool: this.data.cardType,
              playerId: this.data.target,
            }),
          ];
        }
      }

      export class Repair extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: Tools;
      }> {
        static readonly type = "repair";

        toSaboteurAction(): [SaboteurAction.Response.Public.Repair] {
          return [
            new SaboteurAction.Response.Public.Repair({
              tool: this.data.cardType,
              playerId: this.data.target,
            }),
          ];
        }
      }

      export class UseMap extends AbstractBroadcastResponse<{
        target: [absoluteY: number, absoluteX: number];
      }> {
        static readonly type = "viewMap";

        toSaboteurAction(): [SaboteurAction.Response.Public.UseMap] {
          const [absoluteY, absoluteX] = this.data.target;
          const [x, y] = FixedArrayGrid2d.absoluteToRelative(
            absoluteX,
            absoluteY,
          );
          return [new SaboteurAction.Response.Public.UseMap({ x, y })];
        }
      }

      export class DiscardCard extends AbstractBroadcastResponse<{
        handNum: number;
      }> {
        static readonly type = "discard";

        toSaboteurAction(): [SaboteurAction.Response.Public.Discard] {
          return [
            new SaboteurAction.Response.Public.Discard({
              handIndex: this.data.handNum,
            }),
          ];
        }
      }

      export class FoundRock extends AbstractBroadcastResponse<
        [absoluteY: number, absoluteX: number]
      > {
        static readonly type = "rock_found";

        toSaboteurAction(): [SaboteurAction.Response.Public.FoundRock] {
          const [absoluteY, absoluteX] = this.data;
          const [x, y] = FixedArrayGrid2d.absoluteToRelative(
            absoluteX,
            absoluteY,
          );
          return [new SaboteurAction.Response.Public.FoundRock({ x, y })];
        }
      }

      export class RoundEnd extends AbstractBroadcastResponse<{
        /** @description winner role */
        winner: PlayerRole;
        roles: { [playerId: string]: PlayerRole };
      }> {
        static readonly type = "round_end";

        toSaboteurAction(): [SaboteurAction.Response.Public.RoundEnd] {
          return [
            new SaboteurAction.Response.Public.RoundEnd({ ...this.data }),
          ];
        }
      }

      export class GameEnd extends AbstractBroadcastResponse<{
        rank: [playerId: string, gold: number][];
      }> {
        static readonly type = "game_end";

        toSaboteurAction(): [SaboteurAction.Response.Public.GameEnd] {
          return [
            new SaboteurAction.Response.Public.GameEnd({
              golds: this.data.rank.reduce(
                (prev, [playerId, gold]) => {
                  prev[playerId] = gold;
                  return prev;
                },
                {} as Record<string, number>,
              ),
            }),
          ];
        }
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
        hand: [cardId: number, reverse?: boolean][];
        role: PlayerRole;
        currentRound: number;
      }> {
        static readonly type = "roundStart";

        toSaboteurAction(): [SaboteurAction.Response.Private.RoundStart] {
          return [
            new SaboteurAction.Response.Private.RoundStart({
              hands: this.data.hand.map(
                ([cardId, reversed]) =>
                  transformIdToCard(
                    cardId,
                    reversed,
                  ) as SaboteurCard.Abstract.Playable,
              ),
              role: this.data.role,
              round: this.data.currentRound,
            }),
          ];
        }
      }

      export class DrawCard extends AbstractPrivateResponse<{ card: number }> {
        static readonly type = "drawCard";

        toSaboteurAction(): [SaboteurAction.Response.Private.Draw] {
          const card = transformIdToCard(
            this.data.card,
          ) as SaboteurCard.Abstract.Playable;
          return [new SaboteurAction.Response.Private.Draw({ card })];
        }
      }

      export class RevealDestination extends AbstractPrivateResponse<{
        x: number;
        y: number;
        /** @description destination card id */
        cardType: number;
      }> {
        static readonly type = "revealDest";

        toSaboteurAction(): [SaboteurAction.Response.Private.RevealDest] {
          const [x, y] = FixedArrayGrid2d.absoluteToRelative(
            this.data.y,
            this.data.x,
          );

          const card = transformIdToCard(
            this.data.cardType,
          ) as SaboteurCard.Path.AbstractDest;

          return [
            new SaboteurAction.Response.Private.RevealDest({ x, y, card }),
          ];
        }
      }

      export class RotatePathCard extends AbstractPrivateResponse<{
        card: number;
      }> {
        static readonly type = "reversePath";

        toSaboteurAction(): [SaboteurAction.Response.Private.Rotate] {
          return [
            new SaboteurAction.Response.Private.Rotate({
              card: transformIdToCard(
                this.data.card,
              ) as SaboteurCard.Path.AbstractCommon,
            }),
          ];
        }
      }

      export class ReceiveGold extends AbstractPrivateResponse<{
        gold: number;
      }> {
        static readonly type = "getGold";

        toSaboteurAction(): [SaboteurAction.Response.Private.ReceiveGold] {
          return [
            new SaboteurAction.Response.Private.ReceiveGold({
              gold: this.data.gold,
            }),
          ];
        }
      }

      export class PlayerState extends AbstractPrivateResponse<{
        // game session state
        round: number;
        // 내꺼
        gold: number;

        // game round state
        role: PlayerRole;

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
        static readonly type = "playerState";

        toSaboteurAction(): [SaboteurAction.Response.Private.PlayerState] {
          // TODO: 각각의 상태 업데이트 action으로 분리
          return [
            new SaboteurAction.Response.Private.PlayerState({
              round: this.data.round,
              myPlayer: {
                gold: this.data.gold,
                role: this.data.role,
                hands: this.data.hands.map(
                  ({ cardId, reverse }) =>
                    transformIdToCard(
                      cardId,
                      reverse,
                    ) as SaboteurCard.Abstract.Playable,
                ),
              },
              currentPlayerId: this.data.currentPlayerId,
              players: this.data.players.map(
                ({ playerId: id, handCount, tool: status }) => ({
                  id,
                  handCount,
                  status,
                }),
              ),
              board: this.data.board.map(
                ({ cardId, reverse, ...absoluteCoord }) => {
                  const [x, y] = FixedArrayGrid2d.absoluteToRelative(
                    absoluteCoord.x,
                    absoluteCoord.y,
                  );
                  const card = transformIdToCard(
                    cardId,
                    reverse,
                  ) as SaboteurCard.Path.Abstract;

                  return { x, y, card };
                },
              ),
            }),
          ];
        }
      }

      export type Actions = InstanceType<
        (typeof Response.Private)[keyof typeof Response.Private]
      >;
    }

    abstract class AbstractExceptionResponse extends AbstractPrivateResponse<string> {}

    export namespace Exception {
      export class Exception extends AbstractExceptionResponse {
        static readonly type = "error";

        toSaboteurAction(): [SaboteurAction.Response.Actions] {
          throw new Error("Method not implemented.");
        }
      }
      export type Actions = Exception;
    }

    export type Actions =
      | Response.Broadcast.Actions
      | Response.Private.Actions
      | Response.Exception.Actions;

    type ToUnion<T> = T[keyof T];
    export const typeToClassMap = [
      ...Object.entries(Response.Broadcast),
      ...Object.entries(Response.Private),
      ...Object.entries(Response.Exception),
    ].reduce(
      (prev, [, cls]) => {
        prev[cls.type] = cls;
        return prev;
      },
      {} as Record<
        string,
        ToUnion<
          typeof Response.Broadcast &
            typeof Response.Private &
            typeof Response.Exception
        >
      >,
    );
  }

  export type Actions = Request.Actions | Response.Actions;
}
