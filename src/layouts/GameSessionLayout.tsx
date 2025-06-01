import { useEffect, useState } from "react";

import { Navigate, Outlet, useParams } from "react-router";

import { GameSessionProvider } from "@/contexts/GameSessionContext";
import { useAuthenticated } from "@/contexts/SessionContext";
import { useSocket } from "@/contexts/SocketContext";

export const GameSessionLayout = () => {
  const roomId = useParams<{ roomId: string }>().roomId;
  if (!roomId) return <Navigate to={{ pathname: "/" }} replace />;

  return <GameSessionLayoutInner roomId={roomId}></GameSessionLayoutInner>;
};

const GameSessionLayoutInner = ({ roomId }: { roomId: string }) => {
  const { userId } = useAuthenticated();
  const socket = useSocket();
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("join_game", { room: roomId, player: userId });

    return () => {
      socket.emit("leave_room", { room: roomId, player: userId });
    };
  }, [socket, roomId, userId]);

  return (
    <GameSessionProvider value={{ roomId, participants, setParticipants }}>
      <Outlet />
    </GameSessionProvider>
  );
};
