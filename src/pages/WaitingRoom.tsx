import { useState, useEffect, useMemo } from "react";

import { Crown } from "lucide-react";
import { useNavigate } from "react-router";

import { useGameSession } from "@/contexts/GameSessionContext";
import { useSocket } from "@/contexts/SocketContext";

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
  // const navigate = useNavigate();
  // const [countdown, setCountdown] = useState<number | null>(null);

  const socket = useSocket();
  const { roomId, capacity, participants, setParticipants } = useGameSession();

  // // 0.5초마다 참가자 1명씩 추가 (총 10명까지) DUMMY
  // useEffect(() => {
  //   let count = participants.length;
  //   const interval = setInterval(() => {
  //     if (count < capacity) {
  //       count += 1;
  //       setParticipants((prev) => [...prev, `Player${count}`]);
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [capacity, participants.length, setParticipants]);

  // useEffect(() => {
  //   const handleParticipantsUpdate = (data: string[]) => {
  //     setParticipants(data);
  //   };

  // socket.on("participantsUpdate", handleParticipantsUpdate);
  //
  // 정리 함수: 컴포넌트 언마운트 시 이벤트 제거
  // return () => {
  // socket.off("participantsUpdate", handleParticipantsUpdate);
  // };
  // }, [socket]);

  // useEffect(() => {
  //   if (participants.length === capacity) {
  //     setCountdown(5);
  //   }
  // }, [participants, capacity]);

  // // 카운트 처리 및 자동 시작
  // useEffect(() => {
  //   if (countdown == null) return;
  //   if (countdown > 0) {
  //     const id = setTimeout(() => setCountdown((prev) => prev! - 1), 1000);
  //     return () => clearTimeout(id);
  //   }
  //   // 카운트 종료 시 게임 페이지로 이동
  //   navigate(`/game/${roomId}`);
  // }, [countdown, navigate, roomId]);

  // const handleCancel = () => {
  //   navigate("/");
  // };

  const gameRoom = useMemo(() => {
    new HSSaboteurRoomAdapter(socket, roomId);
  }, [socket, roomId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-base-100 p-6">
      <div className="mb-6 w-full max-w-md rounded bg-primary p-4 shadow">
        <p className="text-center text-lg font-semibold text-white">
          현재인원 : {participants.length} | 정원 : {capacity} | 방코드 :{" "}
          {roomId}
        </p>
      </div>
      {/* 참가자 목록 */}
      <div className="mb-6 grid w-full max-w-md grid-cols-2 grid-rows-5 gap-4">
        {participants.map((name, idx) => (
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
        {Array.from({ length: capacity - participants.length }).map(
          (_, idx) => (
            <div
              key={participants.length + idx}
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
