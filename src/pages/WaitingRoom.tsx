import { useState, useEffect } from "react";

import { Crown } from "lucide-react";
import { useNavigate } from "react-router";

import { useGameRoom } from "@/contexts/GameRoomContext";

const palette = [
  "bg-blue-300",
  "bg-red-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-cyan-200",
  "bg-orange-200",
  "bg-indigo-200",
  "bg-pink-200",
  "bg-teal-200",
];

const WaitingRoom = () => {
  const navigate = useNavigate();

  const { gameRoom } = useGameRoom();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [players, setPlayers] = useState<string[]>(() =>
    gameRoom.players.map((p) => p.name),
  );

  useEffect(() => {
    const unsubscribes = [
      gameRoom.adapter.onPlayerJoin((player) => {
        setPlayers((prev) => [...prev, player.name]);
      }),
      gameRoom.adapter.onPlayerLeave((player) => {
        setPlayers((prev) => prev.filter((name) => name !== player.name));
      }),
      gameRoom.adapter.onGameSessionReady(() => {
        setCountdown(5);
      }),
    ];

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  }, [gameRoom]);

  // 카운트 처리 및 자동 시작
  useEffect(() => {
    if (countdown == null) return;
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown((prev) => prev! - 1), 1000);
      return () => clearTimeout(id);
    }

    // 카운트 종료 시 게임 페이지로 이동
    // TODO: 게임 객체 생성?
    navigate(`/game/${gameRoom.id}`);
  }, [countdown, navigate, gameRoom]);

  const handleCancel = () => {
    gameRoom.adapter.leaveRoom();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-base-100 p-6">
      <div className="mb-6 w-full max-w-md rounded bg-primary p-4 shadow">
        <p className="text-center text-lg font-semibold text-white">
          현재인원 : {players.length} | 정원 : {gameRoom.capacity} | 방코드 :{" "}
          {gameRoom.id}
        </p>
      </div>
      {/* 참가자 목록 */}
      <div className="mb-6 grid w-full max-w-md grid-cols-2 grid-rows-5 gap-4">
        {players.map((name, idx) => (
          <div
            key={idx}
            className={`rounded p-2 text-center text-black shadow ${palette[idx]}`}
          >
            {idx === 0 && (
              <Crown className="mr-1 inline-block h-4 w-4 text-yellow-500" />
            )}
            {name}
          </div>
        ))}
        {/* 빈 슬롯 */}
        {Array.from({ length: gameRoom.capacity - players.length }).map(
          (_, idx) => (
            <div
              key={players.length + idx}
              className="rounded bg-base-300 p-2 shadow"
            />
          ),
        )}
      </div>
      <button
        onClick={handleCancel}
        disabled={countdown === 0}
        className={`btn mb-6 w-full max-w-md btn-error ${countdown === 0 ? "cursor-not-allowed opacity-50" : ""}`}
      >
        매칭 취소
      </button>
      {countdown !== null && (
        <div className="text-center text-xl font-bold">
          게임이 {countdown}초 후에 자동으로 시작됩니다...
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
