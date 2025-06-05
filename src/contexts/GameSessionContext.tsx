import { createContext, Provider, useContext } from "react";

export interface GameSessionContext {
  roomId: string;
  participants: string[];
  capacity: number;
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  setCapacity: React.Dispatch<React.SetStateAction<number>>;
}

const GameSessionContext = createContext<GameSessionContext | null>(null);

export const GameSessionProvider =
  GameSessionContext as Provider<GameSessionContext>;

export const useGameSession = () => {
  const context = useContext(GameSessionContext);

  if (!context) {
    throw new Error(
      "useGameSession must be used within a GameSessionProvider with gameId and socket",
    );
  }

  return context;
};
