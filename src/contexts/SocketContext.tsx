import { createContext, useContext, useMemo } from "react";

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

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
