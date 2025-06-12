import { useMemo, useRef, useState } from "react";

import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { useGameRoom } from "@/contexts/GameRoomContext";
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
  const { gameRoom } = useGameRoom();
  const boardRef = useRef<HTMLDivElement>(null);
  /**
   * 보드 좌상단 슬롯의 좌표
   * @todo setAnchorCoord를 옮겨 보드 위치 변환
   */
  const [anchorCoord, _] = useState<[number, number]>(() =>
    CardinalDirection.moveTo(GameBoard.originCoordinates, [-1, -3]),
  );
  const [selectedCard, setSelectedCard] =
    useState<SaboteurCard.Abstract.Playable | null>(null);

  const possibleSlots = useMemo(() => {
    if (
      !selectedCard ||
      !(selectedCard instanceof SaboteurCard.Path.Abstract) ||
      !gameRoom.cardHelper
    )
      return [];
    return board.getPossiblePositions(selectedCard);
  }, [gameRoom, board, selectedCard]);

  useDndMonitor({
    onDragStart: (event) => {
      if (!event.active.data.current || !("card" in event.active.data.current))
        return;
      const { card } = event.active.data.current as DraggableCardData;
      setSelectedCard(card);
    },
    onDragEnd: (event) => {
      setSelectedCard(null);

      if (
        !onDropCard ||
        !event.over ||
        !event.over.id.toString().startsWith("boardSlot")
      )
        return;

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

          const isPossibleSlot = possibleSlots.some(
            ([slotX, slotY]) => slotX === x && slotY === y,
          );

          return (
            <BoardSlot
              x={x}
              y={y}
              card={card}
              isPossibleSlot={isPossibleSlot}
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
  isPossibleSlot,
  style,
  className,
}: {
  x: number;
  y: number;
  card: SaboteurCard.Path.Abstract | null;
  isPossibleSlot?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const id = `boardSlot:${x}:${y}`;
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
        (x + y) % 2 === 0 ? "bg-base-300/10" : "bg-base-300/30",
        className,
      )}
    >
      {/* {`${x},${y}`} */}
      {card && <Card card={card} size={CARD_WIDTH} fixed />}
      {isPossibleSlot && (
        <div
          className="absolute inset-0 border-2 border-dashed border-yellow-300"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
};
