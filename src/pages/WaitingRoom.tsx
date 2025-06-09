import { useEffect, useMemo } from "react";

import { Crown } from "lucide-react";
import { useNavigate } from "react-router";

import { useGameRoom } from "@/contexts/GameRoomContext";

import lobby_bg from "/bg/lobby_bg.png";

const palette = [
  // Using more opaque and slightly darker shades for better contrast with white text
  "bg-slate-700/90",
  "bg-neutral-700/90",
  "bg-stone-700/90",
  "bg-red-700/90",
  "bg-orange-700/90",
  "bg-amber-700/90",
  "bg-lime-700/90",
  "bg-emerald-700/90",
  "bg-cyan-700/90",
  "bg-sky-700/90",
];

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { gameRoom } = useGameRoom();

  const gridColClass = useMemo(() => {
    const count = gameRoom.capacity ?? 0;
    const colMap: Record<number, string> = {
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-4",
      7: "grid-cols-4",
      8: "grid-cols-4",
      9: "grid-cols-5",
      10: "grid-cols-5",
    };
    return colMap[count] || "grid-cols-4";
  }, [gameRoom.capacity]);

  useEffect(() => {
    // 카운트 종료 시 게임 페이지로 이동
    if (gameRoom.remainingSecond === 0) {
      navigate(`/saboteur/${gameRoom.id}/game/`);
    }
  }, [navigate, gameRoom.remainingSecond, gameRoom.id]);

  const handleCancel = () => {
    gameRoom.adapter.leaveRoom();
    navigate("/");
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between bg-cover bg-center p-4 sm:p-6 md:p-8"
      style={{ backgroundImage: `url(${lobby_bg})` }}
    >
      <p className="mt-4 mb-2 text-center text-5xl font-bold text-white sm:text-6xl">
        대기실
      </p>

      <div className="mb-3 flex flex-col items-center gap-x-6 gap-y-2 text-lg font-semibold text-white sm:mb-4 sm:flex-row sm:text-xl">
        <p>현재인원 : {gameRoom.players.length}</p>
        <p>정원 : {gameRoom.capacity}</p>
        <p>방코드 : {gameRoom.id}</p>
      </div>

      {gameRoom.remainingSecond !== null && (
        <div className="mb-3 text-center text-xl font-bold text-white sm:mb-4 sm:text-2xl">
          게임이 {gameRoom.remainingSecond}초 후에 자동으로 시작됩니다...
        </div>
      )}

      {/* 참가자 목록 */}
      <div className="flex w-full max-w-md flex-1 items-center justify-center sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
        <div
          className={`grid ${gridColClass} w-full items-stretch gap-4 sm:gap-6`}
        >
          {gameRoom.players.map((player, idx) => (
            <div
              key={idx}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl border-8 border-neutral-800 p-2 text-center text-xl text-white shadow-lg sm:text-2xl ${palette[idx]}`}
            >
              {idx === 0 && (
                <Crown className="mb-1 h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
              )}
              <span className="break-all">{player.name}</span>
            </div>
          ))}

          {Array.from({
            length: gameRoom.capacity - gameRoom.players.length,
          }).map((_, idx) => (
            <div
              key={gameRoom.players.length + idx}
              className="flex aspect-square items-center justify-center rounded-xl border-8 border-neutral-800 bg-neutral-900/70 p-2 shadow-lg"
            >
              <span className="loading loading-lg text-white sm:loading-xl"></span>
            </div>
          ))}
        </div>
      </div>

      {/* 매칭 취소 버튼 */}
      <button
        onClick={handleCancel}
        disabled={gameRoom.remainingSecond === 0}
        className={`btn mt-4 mb-2 btn-wide text-lg btn-xl btn-error sm:mt-6 sm:text-xl ${
          gameRoom.remainingSecond === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        매칭 취소
      </button>
    </div>
  );
};

export default WaitingRoom;
