/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function useSocketRequest<
  Req extends Exclude<keyof EmitEvents, "game_action">,
  Res extends Exclude<
    keyof ListenEvents,
    "game_update" | "private_game_update"
  >,
>(requestEvent: Req, responseEvent: Res) {
  const socket = useSocket();

  return useCallback(
    async (data: Omit<Parameters<EmitEvents[Req]>[0], "requestId">) => {
      const requestId = crypto.randomUUID();

      socket.emit(requestEvent, ...([{ ...data, requestId }] as any));

      return new Promise<Parameters<ListenEvents[Res]>[0]>(
        (resolve, reject) => {
          const listener = (data: Parameters<ListenEvents[Res]>[0]) => {
            if (!data.requestId || data.requestId !== requestId) return;

            if (data.success) {
              resolve(data);
            } else {
              reject(new Error(data.message || "Request failed"));
            }

            socket.off(responseEvent, listener as any);
          };

          socket.on(responseEvent, listener as any);
        },
      );
    },
    [socket, requestEvent, responseEvent],
  );
}
