import { useEffect, useMemo, useRef, useState } from "react";

import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { GameBoard } from "@/libs/saboteur/board";
import {
  AbstractCard,
  CardinalDirection,
  PathCard,
} from "@/libs/saboteur/cards";

import {
  Card,
  CARD_HEIGHT,
  CARD_RATIO,
  CARD_WIDTH,
  DraggableCardData,
} from "./Card";

interface BoardProps {
  cards: (PathCard.Abstract | null)[][];
  onDropCard?: (
    x: number,
    y: number,
    card: AbstractCard,
    prevCard: PathCard.Abstract | null,
  ) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const BOARD_ROWS = 23;
export const BOARD_COLS = 23;

const BOARD_VISIBLE_ROWS = 11;
const BOARD_VISIBLE_COLS = 7;

const board = new GameBoard();

// TODO: 카드 드래그할때 불필요한 스크롤링 방지
// 바깥 영역에서만 스크롤 한칸씩 되도록?
export const Board = ({ onDropCard, style, className }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [anchorCoord, setAnchorCoord] = useState<[number, number]>(() =>
    CardinalDirection.moveTo(GameBoard.originCoordinates, [-1, -3]),
  );

  useDndMonitor({
    onDragEnd: (event) => {
      if (!event.over || !onDropCard) return;

      const { card } = event.active.data.current as DraggableCardData;
      const { x, y, card: prevCard } = event.over.data.current as BoardSlotData;

      onDropCard(x, y, card, prevCard);
    },
  });

  // const cards = useMemo(() => {
  //   //  toSparseRepresentation
  //   const [anchorX, anchorY] = anchorCoord;

  //   return Array.from({ length: BOARD_VISIBLE_COLS }, (_, deltaY) =>
  //     Array.from({ length: BOARD_VISIBLE_ROWS }, (_, deltaX) => {
  //       const x = anchorX + deltaX;
  //       const y = anchorY + deltaY;

  //       return board.getCard(x, y);
  //     }),
  //   );
  // }, [anchorCoord]);

  // console.log("Board cards:", cards);

  return (
    <section
      style={{
        width: CARD_WIDTH * BOARD_VISIBLE_ROWS,
        height: CARD_HEIGHT * BOARD_VISIBLE_COLS,
        gridTemplateColumns: `repeat(${BOARD_COLS}, ${CARD_WIDTH}px)`,
        gridTemplateRows: `repeat(${BOARD_ROWS}, ${CARD_HEIGHT}px)`,
        ...style,
      }}
      className={twMerge(
        "grid h-full w-full snap-both overflow-hidden",
        className,
      )}
      ref={boardRef}
    >
      {Array.from({ length: BOARD_VISIBLE_COLS }, (_, deltaY) =>
        Array.from({ length: BOARD_VISIBLE_ROWS }, (_, deltaX) => {
          const [x, y] = CardinalDirection.moveTo(anchorCoord, [
            deltaX,
            deltaY,
          ]);
          const card = board.getCard(x, y);
          console.log({ x, y, card, anchorCoord, deltaX, deltaY });

          return (
            <BoardSlot
              x={x}
              y={y}
              card={card}
              style={{ gridRow: deltaY + 1, gridColumn: deltaX + 1 }}
            />
          );
        }),
      )}
    </section>
  );
};

export interface BoardSlotData {
  x: number;
  y: number;
  card: PathCard.Abstract | null;
}

const BoardSlot = ({
  x,
  y,
  card,
  style,
  className,
}: {
  x: number;
  y: number;
  card: PathCard.Abstract | null;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const id = `droppable:${x}:${y}`;
  const { setNodeRef } = useDroppable({
    id,
    data: { x, y, card } as BoardSlotData,
  });

  return (
    <div
      id={id}
      ref={setNodeRef}
      style={{ ...style, width: CARD_WIDTH, aspectRatio: CARD_RATIO }}
      className={twMerge(
        `relative flex snap-center items-center justify-center border border-gray-300`,
        (x + y) % 2 === 0 ? "bg-base" : "bg-base-300",
        className,
      )}
    >
      {/* {`${x},${y}`} */}
      {card && <Card card={card} size={CARD_WIDTH} fixed />}
    </div>
  );
};
