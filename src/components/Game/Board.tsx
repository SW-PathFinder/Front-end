import { useRef, useState } from "react";

import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { GameBoard } from "@/libs/saboteur/board";
import { CardinalDirection, SaboteurCard } from "@/libs/saboteur/cards";

import {
  Card,
  CARD_HEIGHT,
  CARD_RATIO,
  CARD_WIDTH,
  DraggableCardData,
} from "./Card";

interface BoardProps {
  board: GameBoard;
  // cards: (SaboteurCard.Path.Abstract | null)[][];
  onDropCard?: (
    x: number,
    y: number,
    card: SaboteurCard.Abstract.Playable,
    prevCard: SaboteurCard.Path.Abstract | null,
  ) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const BOARD_ROWS = 23;
export const BOARD_COLS = 23;

const BOARD_VISIBLE_ROWS = 11;
const BOARD_VISIBLE_COLS = 7;

// TODO: 카드 드래그할때 불필요한 스크롤링 방지
// 바깥 영역에서만 스크롤 한칸씩 되도록?
export const Board = ({ board, onDropCard, style, className }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  /**
   * 보드 좌상단 슬롯의 좌표
   * @todo setAnchorCoord를 옮겨 보드 위치 변환
   */
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

          return (
            <BoardSlot
              x={x}
              y={y}
              card={card}
              style={{ gridRow: deltaY + 1, gridColumn: deltaX + 1 }}
              key={`${x}:${y}`}
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
  card: SaboteurCard.Path.Abstract | null;
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
  card: SaboteurCard.Path.Abstract | null;
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
