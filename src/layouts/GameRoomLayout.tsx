import { useCallback, useEffect, useRef, useState } from "react";

import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";
import { GameRoomProvider } from "@/contexts/GameRoomContext";
import { useSocketRequest } from "@/contexts/SocketContext";
import { useOpenViduSession } from "@/libs/openvidu";

export const GameRoomLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, gameRoom, setGameRoom } = useAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  // reconnect previous game room if exists
  const params = useParams<{ roomId?: string }>();
  const joinExistRoom = useSocketRequest("join_game", [
    "join_game_result",
    "error",
  ]);

  const connectExistingRoom = useCallback(
    async (userId: string, roomId: string) => {
      try {
        setIsLoading(true);
        const result = await joinExistRoom({ player: userId, room: roomId });
        if (result.event === "error") throw new Error(result.data);

        setGameRoom({
          id: result.data.room.room_id,
          players: result.data.room.players.map((pid) => ({
            id: pid,
            name: pid,
          })),
          host: { id: result.data.room.host, name: result.data.room.host },
          capacity: result.data.room.max_players,
          isPublic: result.data.room.is_public,
          cardHelper: result.data.room.card_helper,
          sessionExists: result.data.room.is_started,
          playerState: result.data.playerState,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [joinExistRoom, setGameRoom],
  );

  useEffect(() => {
    if (gameRoom || !params.roomId) {
      setIsLoading(false);
      return;
    }
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const roomId = params.roomId;

    connectExistingRoom(userId, roomId)
      .catch(() => {
        navigate("/", { state: { from: location.pathname }, replace: true });
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  }, [
    userId,
    gameRoom,
    params.roomId,
    connectExistingRoom,
    navigate,
    location.pathname,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-xl loading-spinner" />
      </div>
    );
  } else if (!gameRoom) {
    return (
      <Navigate
        to={{ pathname: "/" }}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <GameRoomProvider gameRoom={gameRoom}>
      <Outlet />
      <OpenViduVoiceSession mySessionId={gameRoom.id} myUserName={userId} />
    </GameRoomProvider>
  );
};

const OpenViduVoiceSession = ({
  mySessionId,
  myUserName,
}: {
  mySessionId: string;
  myUserName: string;
}) => {
  const { remotes, mainVideoRef, videoContainerRef } = useOpenViduSession(
    mySessionId,
    myUserName,
  );

  return (
    <OpenViduVoiceSessionContainer
      mainVideoRef={mainVideoRef}
      videoContainerRef={videoContainerRef}
      remotes={remotes}
    />
  );
};

export const OpenViduVoiceSessionContainer = ({
  mainVideoRef,
  videoContainerRef,
  remotes,
}: {
  mainVideoRef: React.RefObject<HTMLVideoElement | null>;
  videoContainerRef: React.RefObject<HTMLDivElement | null>;
  remotes: { uid: string; element: HTMLVideoElement }[];
}) => {
  const { volume } = useAuthenticated();

  return (
    <section className="invisible">
      <video
        ref={(el) => {
          if (el) {
            el.volume = volume / 100;
          }
        }}
        autoPlay
        playsInline
      />

      <div ref={videoContainerRef}>
        {remotes.map((remote, idx) => (
          <div key={idx} className="video-container">
            <video
              autoPlay
              playsInline
              ref={(el) => {
                if (el) {
                  el.srcObject = remote.element.srcObject;
                  el.volume = volume / 100;
                }
              }}
            />
            <p>{remote.uid}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
