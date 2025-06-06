import { useState, useEffect } from "react";

export type RoundSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentRound: number;
  winner: "worker" | "saboteur";
  roles: Record<string, "worker" | "saboteur">;
  currentUser: string;
  goldEarned?: number;
};

const RoundSummaryModal = ({
  isOpen,
  onClose,
  currentRound,
  winner,
  roles,
  currentUser,
  goldEarned = 0,
}: RoundSummaryModalProps) => {
  const [remaining, setRemaining] = useState<number>(10);

  useEffect(() => {
    if (isOpen) setRemaining(10);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (remaining <= 0) {
      onClose();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [isOpen, remaining, onClose]);

  if (!isOpen) return null;

  const winnerLabel = winner === "worker" ? "광부 승리!" : "방해꾼 승리!";

  const currentRole = roles[currentUser];
  const isWinner = currentRole === winner;

  return (
    <dialog open className="modal-open modal">
      <div className="relative modal-box max-w-md">
        <button
          className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="mb-2 text-center text-xl font-bold">
          {currentRound} 라운드 {winnerLabel}
        </h3>

        <p className="mb-4 text-center text-sm text-gray-500">
          자동으로 닫힐 때까지: {remaining}초
        </p>

        <div className="mx-4 my-8">
          <ul className="space-y-1">
            {Object.entries(roles).map(([name, role]) => (
              <li key={name} className="flex items-center justify-between">
                <span>{name}</span>
                <span
                  className={
                    role === "saboteur"
                      ? "font-semibold text-red-500"
                      : "font-semibold"
                  }
                >
                  {role === "worker" ? "광부" : "방해꾼"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-2 text-center">
          {isWinner ? (
            <p className="text-primary">
              획득한 금액: <span className="font-bold">{goldEarned} 골드</span>
            </p>
          ) : (
            <p className="text-gray-500">패배하여 골드를 획득할 수 없습니다.</p>
          )}
        </div>

        <div className="modal-action justify-center">
          <button className="btn btn-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default RoundSummaryModal;
