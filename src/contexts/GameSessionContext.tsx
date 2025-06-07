import {
  createContext,
  Provider,
  useContext,
  useEffect,
  useState,
} from "react";

import { SaboteurSession } from "@/libs/saboteur/game";

export interface GameSessionContext {
  gameSession: SaboteurSession;
}

const GameSessionContext = createContext<GameSessionContext | null>(null);

export const GameSessionProvider =
  GameSessionContext as Provider<GameSessionContext>;

export const useGameSession = () => {
  const context = useContext(GameSessionContext);
  const [, setReload] = useState(0);

  if (!context) {
    throw new Error(
      "useGameSession must be used within a GameSessionProvider with gameId and socket",
    );
  }

  useEffect(() => {
    context.gameSession.onAny(() => {
      setReload((prev) => prev + 1);
    });
  }, [context.gameSession]);

  return context;
};
