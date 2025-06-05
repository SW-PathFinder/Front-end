import { useCallback, useEffect } from "react";

import { useGameSession } from "@/contexts/GameSessionContext";
import { useAuthenticated } from "@/contexts/SessionContext";
import { useSocket } from "@/contexts/SocketContext";
import { SocketAction } from "@/services/socket/gameAction";

export function useGameActionEmitter() {
  const socket = useSocket();
  const { userId } = useAuthenticated();
  const { roomId } = useGameSession();

  return useCallback(
    (action: SocketAction.Request.Actions) => {
      socket.emit("game_action", {
        action: action.toPrimitive(),
        room: roomId,
        player: userId,
        requestId: crypto.randomUUID(),
      });
    },
    [socket, userId, roomId],
  );
}

export function useGameActionListener<
  Action extends SocketAction.Response.Actions,
>(type: Action["type"], listener: (action: Action) => void): void {
  const socket = useSocket();

  useEffect(() => {
    const event =
      SocketAction.Response.typeToClassMap[type].prototype.target === "all"
        ? "game_update"
        : "private_game_update";

    const listenerWrapper = (data: SocketAction.Response.Primitive) => {
      if (data.type !== type) return;

      return listener(
        SocketAction.AbstractResponse.fromPrimitive(data) as Action,
      );
    };

    socket.on(event, listenerWrapper);

    return () => {
      socket.off(event, listenerWrapper);
    };
  }, [socket, type, listener]);
}
