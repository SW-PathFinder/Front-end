import { useEffect, useState } from "react";

import { Navigate, Outlet, useParams } from "react-router";

import { GameSessionProvider } from "@/contexts/GameSessionContext";
import { useAuthenticated } from "@/contexts/SessionContext";
import { useSocketEmitter } from "@/contexts/SocketContext";

export const GameSessionLayout = () => {
  const roomId = useParams<{ roomId: string }>().roomId;
  if (!roomId) return <Navigate to={{ pathname: "/" }} replace />;

  return <GameSessionLayoutInner roomId={roomId}></GameSessionLayoutInner>;
};

const GameSessionLayoutInner = ({ roomId }: { roomId: string }) => {
  const { userId } = useAuthenticated();
  const [participants, setParticipants] = useState<string[]>([]);

  const joinGame = useSocketEmitter("join_game");
  const leaveRoom = useSocketEmitter("leave_room");

  useEffect(() => {
    joinGame({ room: roomId, player: userId });

    return () => {
      leaveRoom({ room: roomId, player: userId });
    };
  }, [joinGame, leaveRoom, roomId, userId]);

  return (
    <GameSessionProvider value={{ roomId, participants, setParticipants }}>
      <Outlet />
    </GameSessionProvider>
  );
};
