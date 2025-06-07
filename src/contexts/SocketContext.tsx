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

type UseSocketRequestReturn<
  TReqType extends Exclude<keyof EmitEvents, "game_action">,
  TResType extends ResponsibleListenEventType,
> = (
  data: Omit<EmitEvents[TReqType], "requestId">,
) => Promise<
  {
    [K in TResType]: { event: K; data: ListenEvents[K] & { success: true } };
  }[TResType]
>;

export function useSocketRequest<
  TReqType extends Exclude<keyof EmitEvents, "game_action">,
  TResType extends ResponsibleListenEventType,
>(
  requestEvent: TReqType,
  responseEvent: TResType,
): UseSocketRequestReturn<TReqType, TResType>;
export function useSocketRequest<
  TReqType extends Exclude<keyof EmitEvents, "game_action">,
  TResType extends ResponsibleListenEventType,
>(
  requestEvent: TReqType,
  responseEvent: TResType[],
): UseSocketRequestReturn<TReqType, TResType>;
export function useSocketRequest(
  requestEvent: Exclude<keyof EmitEvents, "game_action">,
  responseEvent: ResponsibleListenEventType | ResponsibleListenEventType[],
) {
  const socket = useSocket();
  responseEvent = Array.isArray(responseEvent)
    ? responseEvent
    : [responseEvent];

  return useCallback(
    async (
      data: Omit<
        EmitEvents[Exclude<keyof EmitEvents, "game_action">],
        "requestId"
      >,
    ) => {
      const requestId = crypto.randomUUID();

      const promise = new Promise<{
        event: ResponsibleListenEventType;
        data: ListenEvents[ResponsibleListenEventType] & { success: true };
      }>((resolve, reject) => {
        const listener = (
          event: ResponsibleListenEventType,
          data: ListenEvents[ResponsibleListenEventType],
        ) => {
          console.log("Socket event received:", event, data);
          if (!responseEvent.includes(event)) return;
          if (!data.requestId || data.requestId !== requestId) return;

          if (data.success) {
            resolve({ event, data: data as any });
          } else {
            reject(new Error(data.message || "Request failed"));
          }

          socket.offAny(listener);
        };

        socket.onAny(listener);
      });

      socket.emit(requestEvent, ...([{ ...data, requestId }] as any));

      return promise;
    },
    [socket, requestEvent, responseEvent],
  );
}
