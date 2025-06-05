import { useEffect, useState } from "react";

import { Outlet, useParams } from "react-router";

import { GameSessionProvider } from "@/contexts/GameSessionContext";
import { useAuthenticated } from "@/contexts/SessionContext";
import { useSocketEmitter } from "@/contexts/SocketContext";
import LobbyPage from "@/pages/LobbyPage";

export const GameSessionLayout = () => {
  const { roomId: paramRoomId } = useParams<{ roomId?: string }>();
  const { userId } = useAuthenticated();

  const [participants, setParticipants] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(paramRoomId ?? "");
  const [capacity, setCapacity] = useState<number>(-1);

  const joinGame = useSocketEmitter("join_game");
  const leaveRoom = useSocketEmitter("leave_room");

  useEffect(() => {
    joinGame({ requestId: "11", room: roomId, player: userId });

    return () => {
      leaveRoom({ requestId: "11", room: roomId, player: userId });
    };
  }, [joinGame, leaveRoom, roomId, userId]);

  return (
    <GameSessionProvider
      value={{
        roomId,
        participants,
        capacity,
        setRoomId,
        setCapacity,
        setParticipants,
      }}
    >
      {roomId ? <Outlet /> : <LobbyPage />}
    </GameSessionProvider>
  );
};
