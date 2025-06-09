import { Crown } from "lucide-react";

export type GameSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rank: Record<string, number>;
};

const GameSummaryModal = ({ isOpen, onClose, rank }: GameSummaryModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal-open modal">
      <div className="relative modal-box max-w-md">
        {/* 닫기 버튼 */}
        <button
          className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
          onClick={onClose}
        >
          ✕
        </button>

        <p className="mb-4 text-center text-xl font-bold">게임 결과</p>

        <ul className="space-y-2">
          {Object.entries(rank)
            .sort(([, aGold], [, bGold]) => bGold - aGold)
            .map(([name, gold], idx) => {
              let colorClass = "";
              if (idx === 0) colorClass = "text-yellow-400";
              else if (idx === 1) colorClass = "text-gray-400";
              else if (idx === 2) colorClass = "text-amber-600";
              return (
                <li
                  key={name}
                  className={`flex justify-between font-semibold ${colorClass} drop-shadow-md`}
                >
                  <span className="flex items-center gap-1">
                    {idx === 0 && <Crown className="h-4 w-4 text-yellow-400" />}
                    {name}
                  </span>
                  <span>{gold} 골드</span>
                </li>
              );
            })}
        </ul>

        <div className="modal-action mt-4 justify-center">
          <button className="btn btn-primary" onClick={onClose}>
            확인
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

export default GameSummaryModal;
