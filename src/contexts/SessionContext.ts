import { createContext, Provider, useContext } from "react";

interface SessionContext {
  gameId: string | null;
  capacity: number | null;
  setGameId: (gameId: string | null) => void;
  setCapacity: (capacity: number | null) => void;
}

const SessionContext = createContext<SessionContext | null>(null);

export const SessionProvider = SessionContext as Provider<SessionContext>;

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useGameSession must be used within a GameSessionProvider");
  }

  return context;
};
