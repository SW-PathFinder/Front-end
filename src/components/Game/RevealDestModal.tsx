import { useEffect, useState } from "react";

import { SaboteurCard } from "@/libs/saboteur/cards";

interface RevealDestModalProps {
  isOpen: boolean;
  onClose?: () => void;
  revealedCard: SaboteurCard.Path.Abstract;
}

const RevealDestModal = ({
  isOpen,
  revealedCard,
  onClose,
}: RevealDestModalProps) => {
  const [remaining, setRemaining] = useState<number>(10);

  useEffect(() => {
    if (isOpen) setRemaining(10);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (remaining <= 0) {
      onClose?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [isOpen, remaining, onClose]);

  if (!isOpen) return null;

  return (
    <dialog open className="modal-open modal">
      <div className="relative modal-box max-w-md">
        <button
          className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="mb-2 text-center text-xl font-bold">목적지 카드 공개</h3>

        <p className="mb-4 text-center text-sm text-gray-500">
          자동으로 닫힐 때까지: {remaining}초
        </p>

        <div className="flex justify-center">
          <img
            src={revealedCard.image}
            alt="Revealed Destination Card"
            className="h-full rounded-xl object-cover"
          />
        </div>

        <div className="modal-action justify-center">
          <button className="btn w-1/2 btn-primary" onClick={onClose}>
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
export default RevealDestModal;
