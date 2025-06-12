import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import { useSocket } from "@/contexts/SocketContext";
import {
  HSSaboteurRoomAdapter,
  SocketAction,
} from "@/libs/saboteur-socket-hoon";
import { SaboteurRoom, SaboteurRoomOption } from "@/libs/saboteur/game";

interface SetGameRoomOption extends SaboteurRoomOption {
  playerState?: SocketAction.Response.Private.PlayerState["data"];
}

interface AuthenticatedContext {
  userId: string;
  gameRoom: SaboteurRoom | null;
  setGameRoom: React.Dispatch<SetGameRoomOption>;
  volume: number;
  setVolume: (volume: number) => void;
}

const AuthenticatedContext = createContext<AuthenticatedContext | null>(null);

export const AuthenticatedProvider = ({
  userId,
  children,
}: PropsWithChildren<{ userId: string }>) => {
  const socket = useSocket();
  const [gameRoom, setGameRoomRaw] = useState<SaboteurRoom | null>(null);
  const [volume, setVolume] = useState(50);

  const setGameRoom = useCallback(
    ({ playerState, ...roomOption }: SetGameRoomOption) => {
      const adapter = new HSSaboteurRoomAdapter(socket, roomOption.id, userId);
      const gameRoom = new SaboteurRoom(adapter, roomOption);

      if (gameRoom.gameSession && playerState) {
        const socketAction = new SocketAction.Response.Private.PlayerState(
          playerState,
          gameRoom.gameSession.currentPlayer.id,
        );
        const [action] = socketAction.toSaboteurAction();
        gameRoom.gameSession.sync(action.data);
      }

      setGameRoomRaw(gameRoom);
    },
    [socket, userId],
  );

  return (
    <AuthenticatedContext
      value={{ userId, gameRoom, setGameRoom, volume, setVolume }}
    >
      {children}
    </AuthenticatedContext>
  );
};

export const useAuthenticated = () => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error(
      "useGameSession must be used within a AuthenticatedProvider",
    );
  }

  return context;
};
