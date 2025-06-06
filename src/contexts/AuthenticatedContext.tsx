import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import { useSocket } from "@/contexts/SocketContext";
import { HSSaboteurRoomAdapter } from "@/libs/saboteur-socket-hoon";
import { SaboteurRoom, SaboteurRoomOption } from "@/libs/saboteur/game";

interface AuthenticatedContext {
  userId: string;
  gameRoom: SaboteurRoom | null;
  setGameRoom: React.Dispatch<SaboteurRoomOption>;
}

const AuthenticatedContext = createContext<AuthenticatedContext | null>(null);

export const AuthenticatedProvider = ({
  userId,
  children,
}: PropsWithChildren<{ userId: string }>) => {
  const socket = useSocket();
  const [gameRoom, setGameRoomRaw] = useState<SaboteurRoom | null>(null);

  const setGameRoom = useCallback(
    (roomOption: SaboteurRoomOption) => {
      const adapter = new HSSaboteurRoomAdapter(socket, roomOption.id, userId);
      const gameRoom = new SaboteurRoom(adapter, roomOption);

      setGameRoomRaw(gameRoom);
    },
    [socket, userId],
  );

  return (
    <AuthenticatedContext value={{ userId, gameRoom, setGameRoom }}>
      {children}
    </AuthenticatedContext>
  );
};

export const useAuthenticated = () => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error("useGameSession must be used within a GameSessionProvider");
  }

  return context;
};
