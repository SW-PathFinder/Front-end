import { GameSessionAdapter } from "@/libs/gameSession";
import { SaboteurSession } from "@/libs/saboteur/game";
import { UnsubscribeCallback } from "@/libs/socket-io";

import { SaboteurAction } from "./action";

export interface SaboteurSessionAdapter extends GameSessionAdapter {
  sendAction<TAction extends SaboteurAction.Request.Actions>(
    action: TAction,
    gameSession: SaboteurSession,
  ): void;

  on<
    TActionType extends SaboteurAction.Response.ActionType,
    TActionClass extends
      SaboteurAction.Response.ActionClass = SaboteurAction.Response.ActionClass & {
      type: TActionType;
    },
  >(
    actionType: TActionType,
    callback: (action: InstanceType<TActionClass>) => void,
  ): UnsubscribeCallback;

  onAny(
    callback: (action: SaboteurAction.Response.Actions) => void,
  ): UnsubscribeCallback;
}
