import { Navigate, Outlet, useLocation } from "react-router";

import { useGameRoom } from "@/contexts/GameRoomContext";
import { GameSessionProvider } from "@/contexts/GameSessionContext";

export const GameSessionLayout = () => {
  const location = useLocation();
  const { gameRoom, gameSession } = useGameRoom();

  if (!gameSession) {
    return (
      <Navigate
        to={{ pathname: `/waiting/${gameRoom.id}` }}
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
