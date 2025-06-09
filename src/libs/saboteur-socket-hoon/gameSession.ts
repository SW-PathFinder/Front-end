/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { HSSaboteurSocket, SocketAction } from "./socket";

type RequestActionEvent = CustomEvent<{
  action: SaboteurAction.Request.Actions;
  socketAction: SocketAction.Request.Actions;
}>;
type ResponseActionEvent = CustomEvent<{
  action: SaboteurAction.Response.Actions;
  socketAction: SocketAction.Response.Actions;
}>;

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: MySaboteurPlayer;

  private readonly inTarget = new EventTarget();
  private readonly outTarget = new EventTarget();

  constructor(
    socket: HSSaboteurSocket,
    roomId: string,
    player: MySaboteurPlayer,
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.player = player;

    this.outTarget.addEventListener("any", ((event: RequestActionEvent) => {
      const { action, socketAction } = event.detail;

      this.socket.emit("game_action", {
        room: this.roomId,
        player: this.player.id,
        action: socketAction.toPrimitive(),
        requestId: action.requestId,
      });
    }) as any);

    this.socket.onAny((type, data) => {
      if (type !== "game_update" && type !== "private_game_update") return;

      const socketAction = SocketAction.AbstractResponse.fromPrimitive(data);
      this.performIn(socketAction);
    });
  }

  private performIn(socketAction: SocketAction.AbstractResponse) {
    const actions = socketAction.toSaboteurAction();

    for (const action of actions) {
      this.inTarget.dispatchEvent(
        new CustomEvent("any", { detail: { action, socketAction } }),
      );
    }
  }

  private toSocketActions(
    action: SaboteurAction.Request.Actions,
    gameSession: SaboteurSession,
  ): SocketAction.Actions[] {
    return saboteurRequestActionMapper[
      action.type as SaboteurAction.Request.ActionType
    ](action as any, gameSession);
  }

  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
    gameSession: SaboteurSession,
  ) {
    const socketActions = this.toSocketActions(action, gameSession);

    for (const socketAction of socketActions) {
      if (socketAction.isRequestActionType()) {
        this.outTarget.dispatchEvent(
          new CustomEvent("any", { detail: { action, socketAction } }),
        );
      } else {
        this.performIn(socketAction);
      }
    }
  }

  onAny(
    callback: (action: SaboteurAction.Response.Actions) => void,
    options: { once?: boolean } = {},
  ) {
    const listener = (event: ResponseActionEvent) => {
      callback(event.detail.action);
    };

    this.inTarget.addEventListener("any", listener as any, {
      once: options.once,
    });
    return () => {
      this.inTarget.removeEventListener("any", listener as any);
    };
  }

  on<
    TSaboteurActionType extends Exclude<
      SaboteurAction.Response.ActionType,
      "game_started"
    >,
    TSaboteurActionClass extends
      SaboteurAction.Response.ActionClass = SaboteurAction.Response.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options: { once?: boolean } = {},
  ) {
    return this.onAny((action) => {
      if (action.type !== actionType) return;
      callback(action as any);
    }, options);
  }

  onAnyOutgoing(
    callback: (action: SaboteurAction.Request.Actions) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback {
    const listener = (event: RequestActionEvent) => {
      callback(event.detail.action);
    };

    this.outTarget.addEventListener("any", listener as any, {
      once: options?.once,
    });
    return () => {
      this.outTarget.removeEventListener("any", listener as any);
    };
  }

  onOutgoing<
    TSaboteurActionType extends SaboteurAction.Request.ActionType,
    TSaboteurActionClass extends
      SaboteurAction.Request.ActionClass = SaboteurAction.Request.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options: { once?: boolean } = {},
  ) {
    return this.onAnyOutgoing((action) => {
      if (action.type !== actionType) return;
      callback(action as any);
    }, options);
  }

  onTurnStart(
    callback: (currentPlayerId: string, duration: number) => void,
  ): UnsubscribeCallback {
    this.socket.on("turn_timer_started", (action) => {
      const { current_player, duration } = action;
      callback(current_player, duration);
    });

    return () => {
      this.socket.off("turn_timer_started");
    };
  }
}

function getHandNumOfCard(
  myPlayer: MySaboteurPlayer,
  card: SaboteurCard.Abstract,
) {
  return myPlayer.hands.findIndex((c) => c.id === card.id);
}

const saboteurRequestActionMapper: {
  [T in SaboteurAction.Request.ActionType]: ActionMapper<T>;
} = {
  path(action: SaboteurAction.Request.Path, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.PlacePath(
        {
          x: action.data.x,
          y: action.data.y,
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        },
        action.requestId,
      ),
    ];
  },
  destroy(
    action: SaboteurAction.Request.Destroy,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.DestroyPath(
        {
          x: action.data.x,
          y: action.data.y,
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        },
        action.requestId,
      ),
    ];
  },
  repair(action: SaboteurAction.Request.Repair, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.Repair(
        {
          target: action.data.player.id,
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
          tool: action.data.tool,
        },
        action.requestId,
      ),
    ];
  },
  sabotage(
    action: SaboteurAction.Request.Sabotage,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.Sabotage(
        {
          target: action.data.player.id,
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        },
        action.requestId,
      ),
    ];
  },
  useMap(action: SaboteurAction.Request.UseMap, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.UseMap(
        {
          x: action.data.x,
          y: action.data.y,
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        },
        action.requestId,
      ),
    ];
  },
  discard(
    action: SaboteurAction.Request.Discard,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.Discard(
        { handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card) },
        action.requestId,
      ),
    ];
  },
  rotate(action: SaboteurAction.Request.Rotate, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.RotatePath(
        { handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card) },
        action.requestId,
      ),
    ];
  },
};

type ActionMapper<
  T extends SaboteurAction.Request.ActionType,
  TClass extends
    SaboteurAction.Request.ActionClass = SaboteurAction.Request.ActionClass & {
    type: T;
  },
> = (
  action: InstanceType<TClass>,
  gameSession: SaboteurSession,
) => SocketAction.Actions[];
