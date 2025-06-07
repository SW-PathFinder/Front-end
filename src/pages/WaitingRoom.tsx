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

  useEffect(() => {
    // 카운트 종료 시 게임 페이지로 이동
    if (gameRoom.remainSecond == 0) navigate(`/game/${gameRoom.id}`);
  }, [navigate, gameRoom.remainSecond, gameRoom.id]);

  const handleCancel = () => {
    gameRoom.adapter.leaveRoom();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-base-100 p-6">
      <div className="mb-6 w-full max-w-md rounded bg-primary p-4 shadow">
        <p className="text-center text-lg font-semibold text-white">
          현재인원 : {gameRoom.players.length} | 정원 : {gameRoom.capacity} |
          방코드 : {gameRoom.id}
        </p>
      </div>

      {/* 참가자 목록 */}
      <div className="mb-6 grid w-full max-w-md grid-cols-2 grid-rows-5 gap-4">
        {gameRoom.players.map((player, idx) => (
          <div
            key={idx}
            className={`rounded p-2 text-center text-black shadow ${palette[idx]}`}
          >
            {idx === 0 && (
              <Crown className="mr-1 inline-block h-4 w-4 text-yellow-500" />
            )}
            {player.name}
          </div>
        ))}

        {/* 빈 슬롯 */}
        {Array.from({
          length: gameRoom.capacity - gameRoom.players.length,
        }).map((_, idx) => (
          <div
            key={gameRoom.players.length + idx}
            className="rounded bg-base-300 p-2 shadow"
          />
        ))}
      </div>

      <button
        onClick={handleCancel}
        disabled={gameRoom.remainSecond === 0}
        className={`btn mb-6 w-full max-w-md btn-error ${gameRoom.remainSecond === 0 ? "cursor-not-allowed opacity-50" : ""}`}
      >
        매칭 취소
      </button>

      {gameRoom.remainSecond !== null && (
        <div className="text-center text-xl font-bold">
          게임이 {gameRoom.remainSecond}초 후에 자동으로 시작됩니다...
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
