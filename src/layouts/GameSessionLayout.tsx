import { useMemo } from "react";

import { Outlet } from "react-router";

import { GameSessionProvider } from "@/contexts/GameSessionContext";
import { useSession } from "@/contexts/SessionContext";

export const GameSessionLayout = () => {
  const { gameId } = useSession();
  if (!gameId) {
    throw new Error(
      "GameSessionLayout must be used within a SessionProvider with gameId",
    );
  }

  const socket = useMemo<WebSocket>(() => {
    const ws = new WebSocket(`ws://localhost:8080/game/${gameId}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  }, [gameId]);

  return (
    <GameSessionProvider value={{ gameId, socket }}>
      <Outlet />
    </GameSessionProvider>
  );
};
