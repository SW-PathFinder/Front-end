/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { io } from "socket.io-client";

import {
  EmitEvents,
  HSSaboteurSocket,
  ListenEvents,
  ResponsibleListenEventType,
} from "@/libs/saboteur-socket-hoon";

const SocketContext = createContext<HSSaboteurSocket | null>(null);
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
    (data: EmitEvents[K]) => {
      socket.emit(event, ...([data] as any));
    },
    [socket, event],
  );
}

export function useSocketListener<
  K extends Exclude<keyof ListenEvents, "game_update" | "private_game_update">,
>(event: K, listener: ListenEvents[K]): void;
export function useSocketListener(
  event: keyof ListenEvents,
  listener: (data: ListenEvents[keyof ListenEvents]) => void,
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
  ReqType extends Exclude<keyof EmitEvents, "game_action">,
  ResType extends ResponsibleListenEventType,
>(requestEvent: ReqType, responseEvent: ResType) {
  const socket = useSocket();

  return useCallback(
    async (data: Omit<EmitEvents[ReqType], "requestId">) => {
      const requestId = crypto.randomUUID();

      socket.emit(requestEvent, ...([{ ...data, requestId }] as any));

      return new Promise<ListenEvents[ResType] & { success: true }>(
        (resolve, reject) => {
          const listener = (data: ListenEvents[ResType]) => {
            console.log("Socket response received:", data);
            if (!data.requestId || data.requestId !== requestId) return;

            if (data.success) {
              resolve(data as any);
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
