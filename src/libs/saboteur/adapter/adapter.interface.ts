import { GameSessionAdapter } from "@/libs/gameSession";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { SaboteurSession } from "../game";
import { SaboteurAction } from "./action";

export interface SaboteurSessionAdapter extends GameSessionAdapter {
  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
    gameSession: SaboteurSession,
  ): void;

  onAny(
    callback: (action: SaboteurAction.Response.Actions) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  on<
    TSaboteurActionType extends SaboteurAction.Response.ActionType,
    TSaboteurActionClass extends
      SaboteurAction.Response.ActionClass = SaboteurAction.Response.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  onAnyOutgoing(
    callback: (action: SaboteurAction.Request.Actions) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  onOutgoing<
    TSaboteurActionType extends SaboteurAction.Request.ActionType,
    TSaboteurActionClass extends
      SaboteurAction.Request.ActionClass = SaboteurAction.Request.ActionClass & {
      type: TSaboteurActionType;
    },
  >(
    actionType: TSaboteurActionType,
    callback: (action: InstanceType<TSaboteurActionClass>) => void,
    options?: { once?: boolean },
  ): UnsubscribeCallback;

  onTurnStart(
    callback: (currentPlayerId: string, duration: number) => void,
  ): UnsubscribeCallback;
}
