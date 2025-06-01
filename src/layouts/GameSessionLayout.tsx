import { useEffect, useMemo, useState } from "react";

import { Outlet } from "react-router";
import { useNavigate } from "react-router";

import { GameSessionProvider } from "@/contexts/GameSessionContext";
import { useSession } from "@/contexts/SessionContext";

export const GameSessionLayout = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<string[]>([]);

  // const { gameId, capacity } = useSession();
  /** DUMMY */
  const gameId = "12345";
  const capacity = 10;
  const socket = "hi";

  useEffect(() => {
    if (!gameId) {
      navigate("/");
    }
  }, [gameId, navigate]);

  // const socket = useMemo<WebSocket | null>(() => {
  //   if (!gameId) {
  //     console.error(
  //       "GameSessionLayout must be used within a SessionProvider with gameId",
  //     );
  //     return null;
  //   }

  //   const ws = new WebSocket(`ws://localhost:8080/game/${gameId}`);

  //   ws.onopen = () => {
  //     console.log("WebSocket connection established");
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return ws;
  // }, [gameId]);

  if (!gameId || capacity == null || !socket) {
    console.error(
      "Redirecting to / because gameId is not set or socket is not created",
    );
    return null;
  }

  return (
    <GameSessionProvider
      value={{ gameId, capacity, socket, participants, setParticipants }}
    >
      <Outlet />
    </GameSessionProvider>
  );
};
