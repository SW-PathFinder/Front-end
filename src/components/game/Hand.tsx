import { twMerge } from "tailwind-merge";
import { Draggable, Droppable } from "./Dnd";
import { useUniqueId } from "@dnd-kit/utilities";
import { Card } from "./Card";
import {
  DragEndEvent,
  UniqueIdentifier,
  useDndContext,
  useDndMonitor,
  useDraggable,
} from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";

interface HandProps {
  cards: { id: UniqueIdentifier; image: string }[];
  className?: string;
}

export const Hand = ({ cards, className }: HandProps) => {
  const id = useUniqueId("hand");

  return (
    <Droppable
      id={id}
      className={twMerge("relative flex items-center", className)}
    >
      {cards.map((card, index) => {
        return (
          <HandCard
            card={card}
            index={index}
            handLength={cards.length}
            key={index}
          />
        );
      })}
    </Droppable>
  );
};

interface HandCardProps {
  card: { id: UniqueIdentifier; image: string };
  /** index in hand */
  index: number;
  handLength: number;
  className?: string;
}
const HandCard = ({ card, index, handLength, className }: HandCardProps) => {
  const { isDragging, node, setNodeRef, listeners, transform } = useDraggable({
    id: card.id,
  });

  const { droppableContainers } = useDndContext();
  const [droppedNode, setDroppedNode] = useState<HTMLElement | null>(null);

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id !== card.id || !over) return;

      const droppedContainer = droppableContainers.get(over.id);
      if (!droppedContainer) return;

      setDroppedNode(droppedContainer.node.current);
    },
    [card.id, droppableContainers],
  );

  useDndMonitor({
    onDragEnd,
  });

  let handTransform: { x: number; y: number; rotate: number } | null = null;
  if (node.current) {
    handTransform = getCardTransform(index, handLength, node.current);
  }

  const transformStyle = {
    ...(handTransform && {
      "--tw-top": `${handTransform.y}px`,
      "--tw-left": `${handTransform.x}px`,
      "--tw-rotate": `${handTransform.rotate}deg`,
    }),
    ...(transform && {
      "--tw-translate-x": `${transform.x}px`,
      "--tw-translate-y": `${transform.y}px`,
    }),
  } as React.CSSProperties;

  return (
    <div
      id={`${card.id}`}
      ref={setNodeRef}
      {...listeners}
      style={transformStyle}
      className={twMerge(
        "relative top-(--tw-top) left-(--tw-left) translate-3d scale-3d",
        "rotate-(--tw-rotate)",
        className,
        isDragging && "",
      )}
    >
      <Card image={card.image} />
    </div>
  );
};

const MAX_CARDS = 6;
const MAX_DEGREE = 60;
const DEGREE_PER_CARD = MAX_DEGREE / MAX_CARDS;

function getCardTransform(
  cardIndex: number,
  handLength: number,
  element: HTMLElement,
) {
  const relativeIndex = cardIndex - (handLength - 1) / 2;
  const degree = DEGREE_PER_CARD * relativeIndex;
  const theta = (degree * Math.PI) / 180;

  const elementRect = element.getBoundingClientRect();
  const { width, height } = getOriginalSize(
    elementRect.width,
    elementRect.height,
    theta,
  );

  // console.log("getCardTransform", elementRect, width, height);

  const radius = height * 2;
  const x = radius * Math.sin(theta) - relativeIndex * width;
  const y = radius - radius * Math.cos(theta);

  // const x = radius * Math

  return { x, y, rotate: degree };
}

function getOriginalSize(
  wr: number,
  hr: number,
  theta: number,
  // opts?: { aspectRatio: number } | { width: number } | { height: number },
) {
  const c = Math.abs(Math.cos(theta));
  const s = Math.abs(Math.sin(theta));
  const det = c * c - s * s;

  // console.log("getOriginalSize", wr, hr, theta, c, s, det);
  // if (Math.abs(det) < Number.EPSILON) {
  //   if (!opts)
  //     throw new Error(
  //       "θ=π/4+π/2·k 에선 w_r===h_r 으로 W,H를 유일 결정할 수 없습니다. "
  //       + "opts.aspectRatio 또는 opts.width/height 중 하나를 전달하세요.",
  //     );

  //   if ("aspectRatio" in opts) {
  //     const r = opts.aspectRatio;
  //     // wr = c·W + s·H, H = W/r
  //     const W = wr / (c + s / r);
  //     return { width: W, height: W / r };
  //   }
  //   if ("width" in opts) {
  //     const W = opts.width;
  //     return { width: W, height: (wr - c * W) / s };
  //   }
  //   if ("height" in opts) {
  //     const H = opts.height;
  //     return { width: (wr - s * H) / c, height: H };
  //   }
  // }

  // 일반적인 경우
  const W = (wr * c - hr * s) / det;
  const H = (hr * c - wr * s) / det;
  return { width: W, height: H };
}
