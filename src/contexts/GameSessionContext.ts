import { createContext, Provider } from "react";

import { useSession } from "@/contexts/SessionContext";

interface GameSessionContext {
  gameId: string;
  socket: WebSocket;
}

const GameSessionContext = createContext<GameSessionContext | null>(null);

export const GameSessionProvider =
  GameSessionContext as Provider<GameSessionContext>;

export const useGameSession = () => {
  const context = useSession();

  if (context) {
    throw new Error(
      "useGameSession must be used within a GameSessionProvider with gameId and socket",
    );
  }

  return context;
};
