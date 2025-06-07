import { useCallback, useEffect } from "react";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";
import { useGameRoom } from "@/contexts/GameRoomContext";
import { useSocket } from "@/contexts/SocketContext";
import { SocketAction } from "@/libs/saboteur-socket-hoon";

export function useGameActionEmitter() {
  const socket = useSocket();
  const { userId } = useAuthenticated();
  const { gameRoom } = useGameRoom();
  const roomId = gameRoom.id;

  return useCallback(
    (action: SocketAction.Request.Actions) => {
      socket.emit("game_action", {
        action: action.toPrimitive() as SocketAction.Request.Actions,
        room: roomId,
        player: userId,
        // requestId: crypto.randomUUID(),
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
