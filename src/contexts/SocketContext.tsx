import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { io, Socket } from "socket.io-client";

import { EmitEvents } from "@/services/socket/event.request";
import { ListenEvents } from "@/services/socket/event.response";

const SocketContext = createContext<Socket<ListenEvents, EmitEvents> | null>(
  null,
);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    newSocket.on("connect", () => {
      console.log(`Socket connected: ${newSocket.id}`);
    });
    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    return newSocket;
  }, []);

  return <SocketContext value={socket}>{children}</SocketContext>;
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export function useSocketEmitter<
  K extends Exclude<keyof EmitEvents, "game_action">,
>(event: K) {
  const socket = useSocket();
  return useCallback(
    (...args: Parameters<EmitEvents[K]>) => {
      socket.emit(event, ...args);
    },
    [socket, event],
  );
}

export function useSocketListener<
  K extends Exclude<keyof ListenEvents, "game_update" | "private_game_update">,
>(event: K, listener: ListenEvents[K]): void;
export function useSocketListener(
  event: keyof ListenEvents,
  listener: ListenEvents[keyof ListenEvents],
) {
  const socket = useSocket();

  useEffect(() => {
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event, listener]);
}
