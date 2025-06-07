import { transformIdToCard } from "@/libs/saboteur-socket-hoon/card";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { SaboteurSession } from "@/libs/saboteur/game";
import { OtherSaboteurPlayer } from "@/libs/saboteur/player";
import { PlayerRole, Tools } from "@/libs/saboteur/types";

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

    abstract toSaboteurAction(
      gameSession: SaboteurSession,
    ): SaboteurAction.Response.Actions;
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

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.GameStart {
          const myPlayer = gameSession.myPlayer;
          const players = this.data.players.map(
            (playerId) => gameSession.players.find((p) => p.id === playerId)!,
          );
          if (!players.includes(myPlayer)) {
            throw new Error(
              `My player with id ${myPlayer.id} not found in the game players.`,
            );
          }

          return new SaboteurAction.Response.Public.GameStart({
            myPlayer,
            players,
          });
        }
      }

      export class TurnChange extends AbstractBroadcastResponse<string> {
        type = "turn_change" as const;
        /** @description next player id */
        declare data;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.TurnChange {
          const player = gameSession.players.find(
            (player) => player.id === this.data,
          );
          if (!player) {
            throw new Error(`Player with id ${this.data} not found.`);
          }

          return new SaboteurAction.Response.Public.TurnChange({ player });
        }
      }

      export class PlacePath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        type = "path" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.Path {
          return new SaboteurAction.Response.Public.Path({
            card: transformIdToCard(
              this.data.card,
            ) as SaboteurCard.Path.AbstractCommon,
            x: this.data.x,
            y: this.data.y,
          });
        }
      }

      export class DestroyPath extends AbstractBroadcastResponse<{
        x: number;
        y: number;
        card: number;
      }> {
        type = "rockFail" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.Destroy {
          return new SaboteurAction.Response.Public.Destroy({
            card: transformIdToCard(
              this.data.card,
            ) as SaboteurCard.Action.Destroy,
            x: this.data.x,
            y: this.data.y,
          });
        }
      }

      export class Sabotage extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: Tools;
      }> {
        type = "sabotage" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.Sabotage {
          const player = gameSession.players.find(
            (player) => player.id === this.data.target,
          );
          if (!player) {
            throw new Error(`Player with id ${this.data.target} not found.`);
          }

          const card = new SaboteurCard.Action.Sabotage(this.data.cardType);

          return new SaboteurAction.Response.Public.Sabotage({ card, player });
        }
      }

      export class Repair extends AbstractBroadcastResponse<{
        /** @description target player id */
        target: string;
        cardType: Tools[];
      }> {
        type = "repair" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Actions {
          const player = gameSession.players.find(
            (player) => player.id === this.data.target,
          );
          if (!player) {
            throw new Error(`Player with id ${this.data.target} not found.`);
          }

          const card = new SaboteurCard.Action.Repair(this.data.cardType);

          return new SaboteurAction.Response.Public.Repair({ card, player });
        }
      }

      export class UseMap extends AbstractBroadcastResponse<{
        target: [x: number, y: number];
      }> {
        type = "viewMap" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.UseMap {
          return new SaboteurAction.Response.Public.UseMap({
            x: this.data.target[0],
            y: this.data.target[1],
            card: new SaboteurCard.Action.Map(),
          });
        }
      }

      export class DiscardCard extends AbstractBroadcastResponse<{
        handNum: number;
      }> {
        type = "discard" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.Discard {
          return new SaboteurAction.Response.Public.Discard({
            card: gameSession.myPlayer.hands[this.data.handNum],
          });
        }
      }

      export class FoundRock extends AbstractBroadcastResponse<
        [x: number, y: number]
      > {
        type = "rock_found" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.FoundRock {
          return new SaboteurAction.Response.Public.FoundRock({
            x: this.data[0],
            y: this.data[1],
          });
        }
      }

      export class RoundEnd extends AbstractBroadcastResponse<{
        /** @description winner role */
        winner: PlayerRole;
        roles: { [playerId: string]: PlayerRole };
      }> {
        type = "round_end" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.RoundEnd {
          const winners = gameSession.players.filter(
            (player) => this.data.roles[player.id] === this.data.winner,
          );

          return new SaboteurAction.Response.Private.RoundEnd({ winners });
        }
      }

      export class GameEnd extends AbstractBroadcastResponse<{
        rank: [playerId: string, gold: number][];
      }> {
        type = "game_end" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Public.GameEnd {
          return new SaboteurAction.Response.Public.GameEnd({
            rank: this.data.rank
              .map(([playerId, gold]) => ({
                player: gameSession.players.find(
                  (player) => player.id === playerId,
                )!,
                gold,
              }))
              .sort((a, b) => b.gold - a.gold),
          });
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
        hand: { cardId: number; reverse?: boolean }[];
        role: PlayerRole;
        currentRound: number;
      }> {
        type = "roundStart" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.RoundStart {
          return new SaboteurAction.Response.Private.RoundStart({
            hands: this.data.hand.map(
              (card) =>
                transformIdToCard(
                  card.cardId,
                  card.reverse,
                ) as SaboteurCard.Abstract.Playable,
            ),
            role: this.data.role,
            round: this.data.currentRound,
          });
        }
      }

      export class DrawCard extends AbstractPrivateResponse<{ card: number }> {
        type = "drawCard" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.Draw {
          return new SaboteurAction.Response.Private.Draw({
            card: transformIdToCard(
              this.data.card,
            ) as SaboteurCard.Abstract.Playable,
          });
        }
      }

      export class RevealDestination extends AbstractPrivateResponse<{
        x: number;
        y: number;
        /** @description destination card id */
        cardType: number;
      }> {
        type = "revealDest" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.RevealDest {
          return new SaboteurAction.Response.Private.RevealDest({
            x: this.data.x,
            y: this.data.y,
            card: transformIdToCard(
              this.data.cardType,
            ) as SaboteurCard.Path.AbstractDest,
          });
        }
      }

      export class RotatePathCard extends AbstractPrivateResponse<{
        card: number;
      }> {
        type = "reversePath" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.Rotate {
          return new SaboteurAction.Response.Private.Rotate({
            card: transformIdToCard(
              this.data.card,
            ) as SaboteurCard.Path.AbstractCommon,
          });
        }
      }

      export class ReceiveGold extends AbstractPrivateResponse<{
        gold: number;
      }> {
        type = "getGold" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.ReceiveGold {
          return new SaboteurAction.Response.Private.ReceiveGold({
            gold: this.data.gold,
            player: gameSession.myPlayer,
          });
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
        type = "playerState" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Private.PlayerState {
          gameSession.players.forEach((player) => {
            player.resetRoundState();
          });

          const myPlayer = gameSession.myPlayer;
          const myPlayerData = this.data.players.find(
            (p) => p.playerId === myPlayer.id,
          );
          if (!myPlayerData) {
            throw new Error(`My player data not found for id ${myPlayer.id}.`);
          }

          myPlayer.sync(
            this.data.gold,
            this.data.hands.map(
              (card) =>
                transformIdToCard(
                  card.cardId,
                  card.reverse,
                ) as SaboteurCard.Abstract.Playable,
            ),
            this.data.role,
            myPlayerData.tool,
          );

          gameSession.players.forEach((player) => {
            if (player instanceof OtherSaboteurPlayer)
              player.handCount = OtherSaboteurPlayer.getInitialHandCount(
                gameSession.players.length,
              );
          });

          const currentPlayer = gameSession.players.find(
            (player) => player.id === this.data.currentPlayerId,
          );
          if (!currentPlayer) {
            throw new Error(
              `Current player with id ${this.data.currentPlayerId} not found.`,
            );
          }

          gameSession.board.import(
            this.data.board.map(({ x, y, cardId, reverse }) => [
              [x, y],
              transformIdToCard(cardId, reverse) as SaboteurCard.Path.Abstract,
            ]),
          );

          return new SaboteurAction.Response.Private.PlayerState({
            round: this.data.round,
            myPlayer,
            currentPlayer,
            players: gameSession.players,
            board: gameSession.board,
          });
        }
      }

      export type Actions = InstanceType<
        (typeof Response.Private)[keyof typeof Response.Private]
      >;
    }

    abstract class AbstractExceptionResponse extends AbstractPrivateResponse<string> {}

    export namespace Exception {
      export class Exception extends AbstractExceptionResponse {
        type = "error" as const;

        toSaboteurAction(
          gameSession: SaboteurSession,
        ): SaboteurAction.Response.Actions {
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
        prev[cls.prototype.type] = cls;
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
