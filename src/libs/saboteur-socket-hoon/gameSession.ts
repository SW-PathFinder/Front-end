/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultRotatedList } from "@/libs/saboteur-socket-hoon/card";
import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { SaboteurSession } from "@/libs/saboteur/game";
import { MySaboteurPlayer } from "@/libs/saboteur/player";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { HSSaboteurSocket, SocketAction } from "./socket";

type RequestActionEvent = CustomEvent<{
  action: SaboteurAction.Request.Actions;
  // socketAction: SocketAction.Request.Actions;
  gameSession: SaboteurSession;
}>;
type ResponseActionEvent = CustomEvent<{
  action: SaboteurAction.Response.Actions;
  socketAction: SocketAction.Response.Actions;
  matchedRequestAction?: SaboteurAction.Request.Actions;
}>;

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;
  private roomId: string;
  private player: MySaboteurPlayer;

  private readonly requestIdMap = new Map<
    string,
    SaboteurAction.Request.Actions
  >();

  /**
   * socket.on("(private_)?game_update") -> inTarget -> this.on
   */
  private readonly inTarget = new EventTarget();
  /**
   * this.sendAction -> outTarget -> socket.emit("game_action")
   */
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
      const { action, gameSession } = event.detail;

      const socketActions = this.toSocketActions(action, gameSession);

      for (const socketAction of socketActions) {
        if (!socketAction.isRequestActionType()) {
          this.performIn(socketAction);
          continue;
        }

        this.requestIdMap.set(socketAction.requestId, action);
        setTimeout(() => {
          this.requestIdMap.delete(socketAction.requestId);
        }, 5000);
        this.socket.emit("game_action", {
          room: this.roomId,
          player: this.player.id,
          action: socketAction.toPrimitive(),
          requestId: socketAction.requestId,
        });
      }
    }) as any);

    this.socket.onAny((type, data) => {
      if (type !== "game_update" && type !== "private_game_update") return;

      const socketAction = SocketAction.AbstractResponse.fromPrimitive(data);
      const matchedRequestAction = socketAction.requestId
        ? this.requestIdMap.get(socketAction.requestId)
        : undefined;
      this.performIn(
        socketAction as SocketAction.Response.Actions,
        matchedRequestAction,
      );
    });
  }

  private performIn(
    socketAction: SocketAction.Response.Actions,
    matchedRequestAction?: SaboteurAction.Request.Actions,
  ) {
    const actions = socketAction.toSaboteurAction(matchedRequestAction);

    for (const action of actions) {
      this.inTarget.dispatchEvent(
        new CustomEvent("any", {
          detail: { action, socketAction, matchedRequestAction },
        }) satisfies ResponseActionEvent,
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
    this.outTarget.dispatchEvent(
      new CustomEvent("any", {
        detail: { action, gameSession },
      }) satisfies RequestActionEvent,
    );
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
  return myPlayer.hands.findIndex((c) => c.uid === card.uid);
}

const saboteurRequestActionMapper: {
  [T in SaboteurAction.Request.ActionType]: ActionMapper<T>;
} = {
  path(action: SaboteurAction.Request.Path, gameSession: SaboteurSession) {
    const defaultRotated = defaultRotatedList.includes(
      action.data.card.constructor as any,
    );
    const isRotated = action.data.card.flipped === defaultRotated;
    const actions: SocketAction.Actions[] = [];
    if (isRotated) {
      actions.push(
        new SocketAction.Request.RotatePath({
          handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        }),
      );
    }
    actions.push(
      new SocketAction.Request.PlacePath({
        x: action.data.x,
        y: action.data.y,
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      }),
    );

    return actions;
  },
  destroy(
    action: SaboteurAction.Request.Destroy,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.DestroyPath({
        x: action.data.x,
        y: action.data.y,
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      }),
    ];
  },
  repair(action: SaboteurAction.Request.Repair, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.Repair({
        target: action.data.player.id,
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
        tool: action.data.tool,
      }),
    ];
  },
  sabotage(
    action: SaboteurAction.Request.Sabotage,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.Sabotage({
        target: action.data.player.id,
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      }),
    ];
  },
  useMap(action: SaboteurAction.Request.UseMap, gameSession: SaboteurSession) {
    return [
      new SocketAction.Request.UseMap({
        x: action.data.x,
        y: action.data.y,
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      }),
    ];
  },
  discard(
    action: SaboteurAction.Request.Discard,
    gameSession: SaboteurSession,
  ) {
    return [
      new SocketAction.Request.Discard({
        handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      }),
    ];
  },
  rotate(action: SaboteurAction.Request.Rotate, gameSession: SaboteurSession) {
    return [
      // new SocketAction.Request.RotatePath({
      //   handNum: getHandNumOfCard(gameSession.myPlayer, action.data.card),
      // }),
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
