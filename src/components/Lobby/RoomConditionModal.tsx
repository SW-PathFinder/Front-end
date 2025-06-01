import { useState } from "react";

interface RoomConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "fastMatch";
}

const RoomConditionModal = ({
  isOpen,
  onClose,
  mode,
}: RoomConditionModalProps) => {
  const [minPerson, setMinPerson] = useState<number>(3);
  const [helper, setHelper] = useState<boolean>(true);
  const [publicRoom, setPublicRoom] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <dialog open className="modal" onCancel={onClose} onClose={onClose}>
      <div className="relative modal-box w-1/2 min-w-md">
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
        {/* 알림 메시지 */}
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
          <span className="ml-2">플레이 환경을 설정해주세요</span>
        </div>

        {/* 설정 폼 */}
        <div className="m-4 my-12 flex flex-col gap-8">
          {/* 플레이 인원 설정 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">최대 플레이 인원</p>
            <div className="flex items-center">
              <button
                className="btn btn-circle btn-ghost"
                onClick={() => setMinPerson((prev) => Math.max(prev - 1, 3))}
              >
                -
              </button>
              <p className="mx-4 text-lg font-bold">{minPerson}명</p>
              <button
                className="btn btn-circle btn-ghost"
                onClick={() => setMinPerson((prev) => Math.min(prev + 1, 10))}
              >
                +
              </button>
            </div>
          </div>

          {/* 카드 배치 도우미 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">카드 배치 도우미</p>
            <label className="label cursor-pointer pr-13.5">
              <input
                type="checkbox"
                className="checkbox checkbox-xl checkbox-primary"
                checked={helper}
                onChange={(e) => setHelper(e.target.checked)}
              />
            </label>
          </div>

          {/* 공개 방 여부 */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">공개 방 여부</p>
            <label className="label cursor-pointer pr-13.5">
              <input
                type="checkbox"
                className="checkbox checkbox-xl checkbox-primary"
                checked={publicRoom}
                onChange={(e) => setPublicRoom(e.target.checked)}
              />
            </label>
          </div>
        </div>
        {/* 생성 버튼 */}
        <button
          type="button"
          className={`btn mt-4 w-full ${mode === "create" ? "btn-secondary" : "btn-accent"}`}
          onClick={() => onClose()}
        >
          {mode === "create" ? "방 생성하기" : "매칭하기"}
        </button>
      </div>
      {/* 모달 백드롭: 클릭 시 닫기 */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default RoomConditionModal;
