import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";
import { GameRoomProvider } from "@/contexts/GameRoomContext";

export const GameRoomLayout = () => {
  const location = useLocation();
  const { gameRoom } = useAuthenticated();

  if (!gameRoom) {
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
