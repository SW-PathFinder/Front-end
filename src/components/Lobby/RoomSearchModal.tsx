import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";
import { useSocketRequest } from "@/contexts/SocketContext";

interface RoomSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoomSearchModal = ({ isOpen, onClose }: RoomSearchModalProps) => {
  const [value, setValue] = useState("");
  const { setGameRoom } = useAuthenticated();
  const navigate = useNavigate();

  const searchRoom = useSocketRequest(
    "search_room_by_code",
    "room_search_result",
  );

  const clickSearch = async () => {
    try {
      const { data } = await searchRoom({ room_code: value });

      setGameRoom({
        id: data.room.room_id,
        players: data.room.players.map((pid) => ({ id: pid, name: pid })),
        host: { id: data.room.host, name: data.room.host },
        capacity: data.room.max_players,
        isPublic: data.room.is_public,
        cardHelper: data.room.card_helper,
      });

      navigate(`/saboteur/${data.room.room_id}/waiting`);
      onClose();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || "방을 찾는 중 오류가 발생했습니다.");
      } else {
        alert("방을 찾는 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal" onCancel={onClose} onClose={onClose}>
      <div className="relative modal-box w-1/2 min-w-md bg-neutral-900">
        {/* 닫기 버튼 */}
        <form method="dialog">
          <button
            type="button"
            className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <div
          role="alert"
          className="alert-outline mt-6 alert flex items-center justify-center alert-info font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="ml-2">방 코드는 4자리의 영어 알파벳입니다.</span>
        </div>

        <div className="m-4 mt-12 flex flex-col items-center">
          <input
            type="text"
            className="validator input input-xl w-full text-center"
            required
            placeholder="Enter 4 Upper letters"
            pattern="[A-Z]{4}"
            minLength={4}
            maxLength={4}
            value={value}
            onChange={(e) => {
              const filtered = e.target.value.replace(/[^a-zA-Z]/g, "");
              setValue(filtered.toUpperCase());
            }}
          />
          <p className="validator-hint items-start">
            방 코드는 4자리의 영어 알파벳입니다. <br />
            예: ABCD
          </p>
        </div>
        <div className="modal-action flex justify-center">
          <button
            type="button"
            className="btn w-full btn-soft btn-primary"
            onClick={() => {
              if (value.length === 4) {
                clickSearch();
              }
            }}
          >
            방 찾기
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default RoomSearchModal;
