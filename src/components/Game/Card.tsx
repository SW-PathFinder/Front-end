import { useState } from "react";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { SaboteurCard } from "@/libs/saboteur/cards";
import { PathCard } from "@/libs/saboteur/cards/path";

interface CardProps {
  card: SaboteurCard.Abstract;
  /**
   * width of card
   * @default 60
   */
  size?: number;
  /** @default false */
  fixed?: boolean;
  transform?: { x?: number; y?: number; rotate?: number };
  style?: React.CSSProperties;
  className?: string;
}

const CARD_ASSET_WIDTH = 60;
const CARD_ASSET_HEIGHT = 97;
export const CARD_RATIO = CARD_ASSET_WIDTH / CARD_ASSET_HEIGHT;
export const CARD_WIDTH = CARD_ASSET_WIDTH * 0.85;
export const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO;

export interface DraggableCardData {
  card: SaboteurCard.Abstract.Playable;
}

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
  } = useDraggable({ id: card.uid, data: { card }, disabled: fixed });
  useDndMonitor({
    onDragStart(event) {
      if (event.active.id !== card.uid) return;
      setIsFocusing(true);
    },
    onDragEnd(event) {
      if (event.active.id !== card.uid) return;
      setIsFocusing(false);
    },
  });

  const isPathCard = card instanceof PathCard.Abstract;

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
        "--tw-rotate": `0deg`,
      }),
    ...(dragTransform && {
      "--tw-translate-x": `${dragTransform.x}px`,
      "--tw-translate-y": `${dragTransform.y}px`,
    }),
  } as React.CSSProperties;

  return (
    <div
      id={`${card.uid}`}
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
        width: size,
        aspectRatio: CARD_RATIO,
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
        "absolute isolate",
        "rounded-sm",
        "top-(--tw-top) left-(--tw-left) z-(--tw-z-index)",
        "translate-3d",
        "rotate-(--tw-rotate)",
        "scale-(--tw-scale)",
        className,
      )}
    >
      {card instanceof SaboteurCard.Path.AbstractDest && card.peeked && (
        <div
          style={{ backgroundImage: `url(${card.bgImage})` }}
          className={twMerge(
            "absolute h-full w-full",
            "origin-center bg-cover bg-center bg-no-repeat",
            "mix-blend-soft-light",
          )}
        />
      )}
      <div
        style={{
          backgroundImage: `url(${card.image})`,
          rotate: `${isPathCard && card.flipped ? 180 : 0}deg`,
        }}
        className={twMerge(
          "absolute h-full w-full",
          "origin-center bg-cover bg-center bg-no-repeat",
          "mix-blend-soft-light",
        )}
      />
    </div>
  );
};
