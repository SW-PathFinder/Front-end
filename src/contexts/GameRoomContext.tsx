import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { SaboteurRoom, SaboteurSession } from "@/libs/saboteur/game";

interface GameRoomContext {
  gameRoom: SaboteurRoom;
  gameSession: SaboteurSession | null;
}

const GameRoomContext = createContext<GameRoomContext | null>(null);

export const GameRoomProvider = ({
  gameRoom,
  children,
}: PropsWithChildren<{ gameRoom: SaboteurRoom }>) => {
  const gameSession = gameRoom.gameSession;

  return (
    <GameRoomContext value={{ gameRoom, gameSession }}>
      {children}
    </GameRoomContext>
  );
};

export const useGameRoom = () => {
  const context = useContext(GameRoomContext);
  const [, setReload] = useState(0);

  if (!context) {
    throw new Error(
      "useGameRoom must be used within a GameRoomProvider with gameRoom and setGameRoom",
    );
  }

  useEffect(() => {
    context.gameRoom.onAny(() => {
      setReload((prev) => prev + 1);
    });
  }, [context.gameRoom]);

  return context;
};
