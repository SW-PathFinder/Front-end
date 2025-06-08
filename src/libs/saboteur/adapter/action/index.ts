import { SocketAction } from "@/libs/saboteur-socket-hoon";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { SaboteurSession } from "@/libs/saboteur/game";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
  OtherSaboteurPlayer,
} from "@/libs/saboteur/player";
import { PlayerRole, Tools } from "@/libs/saboteur/types";

abstract class Action<T = unknown> {
  readonly data: T;
  readonly requestId?: string;

  constructor(data: T, requestId?: string) {
    this.data = data;
    this.requestId = requestId;
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

      constructor(data: T) {
        super(data, crypto.randomUUID());
      }

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
        return new SocketAction.Request.PlacePath(
          {
            x: this.data.x,
            y: this.data.y,
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
          },
          this.requestId,
        );
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
        return new SocketAction.Request.DestroyPath(
          {
            x: this.data.x,
            y: this.data.y,
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
          },
          this.requestId,
        );
      }
    }

    export class Repair
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Repair;
        tool: Tools;
      }>
      implements SocketTransformable
    {
      static readonly type = "repair";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.Repair(
          {
            target: this.data.player.id,
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
            tool: this.data.tool,
          },
          this.requestId,
        );
      }
    }

    export class Sabotage
      extends Request.Primitive<{
        player: AbstractSaboteurPlayer;
        card: SaboteurCard.Action.Sabotage;
        tool: Tools;
      }>
      implements SocketTransformable
    {
      static readonly type = "sabotage";

      toSocketAction(
        gameSession: SaboteurSession,
      ): SocketAction.Request.Actions {
        return new SocketAction.Request.Sabotage(
          {
            target: this.data.player.id,
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
            tool: this.data.tool,
          },
          this.requestId,
        );
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
        return new SocketAction.Request.UseMap(
          {
            x: this.data.x,
            y: this.data.y,
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
          },
          this.requestId,
        );
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
        return new SocketAction.Request.Discard(
          {
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
          },
          this.requestId,
        );
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
        return new SocketAction.Request.RotatePath(
          {
            handNum: this.getHandNumOfCard(
              gameSession.myPlayer,
              this.data.card,
            ),
          },
          this.requestId,
        );
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
    export type ActionType = ActionClass["type"];
  }

  export namespace Response {
    export abstract class Primitive<T> extends Action<T> {
      readonly eventType = "response";

      abstract update(gameSession: SaboteurSession): void;
    }

    export namespace Public {
      export class Path extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        static readonly type = "path";

        update(gameSession: SaboteurSession): void {
          const { x, y, card } = this.data;
          gameSession.board.placeCard(x, y, card);
        }
      }

      export class Destroy extends Response.Primitive<{
        x: number;
        y: number;
      }> {
        static readonly type = "destroy";

        update(gameSession: SaboteurSession): void {
          const { x, y } = this.data;
          gameSession.board.removeCard(x, y);
        }
      }

      export class Repair extends Response.Primitive<{
        tool: Tools;
        playerId: string;
      }> {
        static readonly type = "repair";

        update(gameSession: SaboteurSession): void {
          const { tool, playerId } = this.data;

          const player = gameSession.players.find((p) => p.id === playerId);
          if (!player) throw new Error(`Player with ID ${playerId} not found.`);

          player.repair(tool);
        }
      }

      export class Sabotage extends Response.Primitive<{
        tool: Tools;
        playerId: string;
      }> {
        static readonly type = "sabotage";

        update(gameSession: SaboteurSession): void {
          const { tool, playerId } = this.data;

          const player = gameSession.players.find((p) => p.id === playerId);
          if (!player) throw new Error(`Player with ID ${playerId} not found.`);

          player.sabotage(tool);
        }
      }

      export class UseMap extends Response.Primitive<{ x: number; y: number }> {
        static readonly type = "useMap";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export class Discard extends Response.Primitive<{ handIndex: number }> {
        static readonly type = "discard";

        update(gameSession: SaboteurSession): void {
          const { handIndex } = this.data;
          gameSession.myPlayer.remove(handIndex);
        }
      }

      export class FoundRock extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.DestRockA | SaboteurCard.Path.DestRockB;
      }> {
        static readonly type = "foundRock";

        update(gameSession: SaboteurSession): void {
          const { x, y, card } = this.data;

          // Place the rock card on the board
          gameSession.board.revealDestination(x, y, card);
        }
      }

      export class GameStart extends Response.Primitive<{
        players: AbstractSaboteurPlayer[];
        myPlayer: MySaboteurPlayer;
      }> {
        static readonly type = "gameStart";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export class TurnChange extends Response.Primitive<{ playerId: string }> {
        static readonly type = "turnChange";

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

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export class GameEnd extends Response.Primitive<{
        golds: { [playerId: string]: number };
      }> {
        static readonly type = "gameEnd";

        update(gameSession: SaboteurSession): void {
          // const { golds } = this.data;
          // TODO: cleanup game session?
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
        | typeof FoundRock
        | typeof GameStart
        | typeof TurnChange
        | typeof RoundEnd
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

        update(gameSession: SaboteurSession): void {
          const { round, hands, role } = this.data;

          gameSession.round = round;

          hands.forEach((card) => gameSession.myPlayer.add(card));
          gameSession.myPlayer.role = role;

          gameSession.players.forEach((player) => {
            if (player instanceof OtherSaboteurPlayer)
              player.handCount = OtherSaboteurPlayer.getInitialHandCount(
                gameSession.players.length,
              );
          });
        }
      }

      export class Draw extends Response.Primitive<{
        card: SaboteurCard.Abstract.Playable;
      }> {
        static readonly type = "draw";

        update(gameSession: SaboteurSession): void {
          const { card } = this.data;
          gameSession.myPlayer.add(card);
        }
      }

      export class RevealDest extends Response.Primitive<{
        x: number;
        y: number;
        card: SaboteurCard.Path.AbstractDest;
      }> {
        static readonly type = "revealDest";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
          const { x, y, card } = this.data;

          card.peeked = true;
          gameSession.board.revealDestination(x, y, card);
        }
      }

      export class Rotate extends Response.Primitive<{
        card: SaboteurCard.Path.AbstractCommon;
      }> {
        static readonly type = "rotate";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
          // const { card } = this.data;
        }
      }

      export class PlayerState extends Response.Primitive<{
        round: number;
        myPlayer: {
          gold: number;
          role: PlayerRole | null;
          hands: SaboteurCard.Abstract.Playable[];
        };
        currentPlayerId: string;
        players: {
          id: string;
          handCount: number;
          status: Record<Tools, boolean>;
        }[];
        board: { x: number; y: number; card: SaboteurCard.Path.Abstract }[];
      }> {
        static readonly type = "playerState";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export class ReceiveGold extends Response.Primitive<{ gold: number }> {
        static readonly type = "receiveGold";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export class Exception extends Response.Primitive<{ message: string }> {
        static readonly type = "exception";

        update(gameSession: SaboteurSession): void {
          // throw new Error("Method not implemented.");
        }
      }

      export type ActionClass =
        | typeof RoundStart
        | typeof Draw
        | typeof RevealDest
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
