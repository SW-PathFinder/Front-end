import { useCallback, useEffect, useRef, useState } from "react";

import { Navigate, Outlet, useLocation, useParams } from "react-router";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";
import { GameRoomProvider } from "@/contexts/GameRoomContext";
import { useSocketRequest } from "@/contexts/SocketContext";

export const GameRoomLayout = () => {
  const location = useLocation();
  const { gameRoom, setGameRoom } = useAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  // reconnect previous game room if exists
  const params = useParams<{ roomId?: string }>();
  const searchRoomById = useSocketRequest(
    "search_room_by_code",
    "room_search_result",
  );

  const connectExistingRoom = useCallback(
    async (roomId: string) => {
      try {
        setIsLoading(true);
        const result = await searchRoomById({ room_code: roomId });
        setGameRoom({
          id: result.data.room.room_id,
          players: result.data.room.players.map((pid) => ({
            id: pid,
            name: pid,
          })),
          host: { id: result.data.room.host, name: result.data.room.host },
          capacity: result.data.room.max_players,
          isPublic: result.data.room.is_public,
          cardHelper: result.data.room.card_helper,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [searchRoomById, setGameRoom],
  );

  useEffect(() => {
    if (gameRoom || !params.roomId) {
      setIsLoading(false);
      return;
    }
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const roomId = params.roomId;

    connectExistingRoom(roomId).finally(() => {
      isFetchingRef.current = false;
    });
  }, [gameRoom, params.roomId, connectExistingRoom]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-xl loading-spinner" />
      </div>
    );
  } else if (!gameRoom) {
    return (
      <Navigate
        to={{ pathname: "/" }}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <GameRoomProvider gameRoom={gameRoom}>
      <Outlet />
    </GameRoomProvider>
  );
};
