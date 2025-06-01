import { useState } from "react";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { AbstractCard } from "@/libs/saboteur/cards";

interface CardProps {
  card: AbstractCard;
  /**
   * width of card
   * @default 64
   */
  size?: number;
  /** @default false */
  fixed?: boolean;
  transform?: { x?: number; y?: number; rotate?: number };
  style?: React.CSSProperties;
  className?: string;
}

export const CARD_RATIO = 1.5;
export const CARD_WIDTH = 64;
export const CARD_HEIGHT = CARD_WIDTH * CARD_RATIO;

export const Card = ({
  card,
  size = CARD_WIDTH,
  fixed = false,
  transform,
  style,
  className,
}: CardProps) => {
  const [isFocusing, setIsFocusing] = useState(false);
  const {
    isDragging,
    setNodeRef,
    listeners,
    transform: dragTransform,
  } = useDraggable({ id: card.id, data: { card }, disabled: fixed });
  useDndMonitor({
    onDragStart(event) {
      if (event.active.id !== card.id) return;
      setIsFocusing(true);
    },
    onDragEnd(event) {
      if (event.active.id !== card.id) return;
      setIsFocusing(false);
    },
  });

  const transformStyle = {
    "--tw-z-index": 1,
    ...(transform && {
      "--tw-top": `${transform?.y ?? 0}px`,
      "--tw-left": `${transform?.x ?? 0}px`,
      "--tw-rotate": `${transform?.rotate ?? 0}deg`,
    }),
    ...(!fixed &&
      isFocusing && {
        "--tw-scale": isDragging ? 1 : 1.2,
        "--tw-z-index": 2,
        "--tw-rotate": 0,
      }),
    ...(dragTransform && {
      "--tw-translate-x": `${dragTransform.x}px`,
      "--tw-translate-y": `${dragTransform.y}px`,
    }),
  } as React.CSSProperties;

  return (
    <div
      id={`${card.id}`}
      ref={setNodeRef}
      {...listeners}
      onMouseEnter={() => {
        setIsFocusing(true);
      }}
      onMouseLeave={() => {
        if (isDragging) return;
        setIsFocusing(false);
      }}
      style={{
        backgroundImage: `url(${card.image})`,
        width: size,
        transition: [
          "top 100ms ease-in-out",
          "left 100ms ease-in-out",
          "rotate 100ms ease-in-out",
          "scale 100ms ease-in-out",
          isDragging ? "translate 25ms linear" : "translate 100ms ease-in-out",
        ].join(", "),
        ...transformStyle,
        ...style,
      }}
      className={twMerge(
        "absolute aspect-[2/3] origin-center bg-cover bg-center bg-no-repeat",
        "top-(--tw-top) left-(--tw-left) z-(--tw-z-index)",
        "translate-3d",
        "rotate-(--tw-rotate)",
        "scale-(--tw-scale)",
        className,
      )}
    >
      <img src={`assets/saboteur/cards/${card.image}`} className="invisible" />
    </div>
  );
};
