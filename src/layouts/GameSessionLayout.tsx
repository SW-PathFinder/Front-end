import { Navigate, Outlet, useLocation } from "react-router";

import { useGameRoom } from "@/contexts/GameRoomContext";
import { GameSessionProvider } from "@/contexts/GameSessionContext";

export const GameSessionLayout = () => {
  const location = useLocation();
  const { gameRoom, gameSession } = useGameRoom();

  if (!gameSession) {
    return (
      <Navigate
        to={{ pathname: `/saboteur/${gameRoom.id}/waiting/` }}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <GameSessionProvider value={{ gameSession }}>
      <Outlet />
    </GameSessionProvider>
  );
};
