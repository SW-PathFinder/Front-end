import {
  Dispatch,
  RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

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

export interface BoardRef {
  resetBoardPosition: () => void;
  moveBoardPosition: Dispatch<CardinalDirection.Adjacent>;
}

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
  hoveredCoord?: { x: number; y: number } | null; // 추가
  ref?: RefObject<BoardRef | null>;
}

const BOARD_VISIBLE_ROWS = 7;
const BOARD_VISIBLE_COLS = 11;

// TODO: 카드 드래그할때 불필요한 스크롤링 방지
// 바깥 영역에서만 스크롤 한칸씩 되도록?
export const Board = ({
  board,
  onDropCard,
  style,
  className,
  hoveredCoord,
  ref,
}: BoardProps) => {
  const { gameRoom } = useGameRoom();
  const boardRef = useRef<HTMLDivElement>(null);
  /**
   * 보드 좌상단 슬롯의 좌표
   * setAnchorCoord를 옮겨 보드 위치 변환 가능
   */
  const [anchorCoord, setAnchorCoord] = useState<[number, number]>(() =>
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

  useEffect(() => {
    if (!window) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAnchorCoord(
          CardinalDirection.moveTo(GameBoard.originCoordinates, [-1, -3]),
        );
      } else if (event.key === "ArrowUp") {
        setAnchorCoord((prev) =>
          CardinalDirection.moveTo(prev, CardinalDirection.North),
        );
      } else if (event.key === "ArrowDown") {
        setAnchorCoord((prev) =>
          CardinalDirection.moveTo(prev, CardinalDirection.South),
        );
      } else if (event.key === "ArrowLeft") {
        setAnchorCoord((prev) =>
          CardinalDirection.moveTo(prev, CardinalDirection.West),
        );
      } else if (event.key === "ArrowRight") {
        setAnchorCoord((prev) =>
          CardinalDirection.moveTo(prev, CardinalDirection.East),
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    moveBoardPosition: (direction: CardinalDirection.Adjacent) => {
      setAnchorCoord((prev) => CardinalDirection.moveTo(prev, direction));
    },
    resetBoardPosition: () => {
      setAnchorCoord(
        CardinalDirection.moveTo(GameBoard.originCoordinates, [-1, -3]),
      );
    },
  }));

  return (
    <section style={style} className={twMerge("relative", className)}>
      {/* board moving overlay */}
      {/* <section className="absolute top-0 left-0 grid h-full w-full grid-cols-9 grid-rows-9">
        <div className="col-span-1 row-span-1 bg-neutral-400 opacity-20" />
        <div className="col-span-7 row-span-1 bg-red-400 opacity-20" />
        <div className="col-span-1 row-span-1 bg-neutral-400 opacity-20" />

        <div className="col-span-1 row-span-7 bg-red-400 opacity-20" />
        <div className="col-span-7 row-span-7" />
        <div className="col-span-1 row-span-7 bg-red-400 opacity-20" />

        <div className="col-span-1 row-span-1 bg-neutral-400 opacity-20" />
        <div className="col-span-7 row-span-1 bg-neutral-400 opacity-20" />
        <div className="col-span-1 row-span-1 bg-red-400 opacity-20" />
      </section> */}

      {/* board slots */}
      <section
        style={{
          width: CARD_WIDTH * BOARD_VISIBLE_COLS,
          height: CARD_HEIGHT * BOARD_VISIBLE_ROWS,
          gridTemplateColumns: `repeat(${BOARD_VISIBLE_COLS}, ${CARD_WIDTH}px)`,
          gridTemplateRows: `repeat(${BOARD_VISIBLE_ROWS}, ${CARD_HEIGHT}px)`,
        }}
        className={twMerge("grid snap-both")}
        ref={boardRef}
      >
        {Array.from({ length: BOARD_VISIBLE_ROWS }, (_, deltaY) =>
          Array.from({ length: BOARD_VISIBLE_COLS }, (_, deltaX) => {
            const [x, y] = CardinalDirection.moveTo(anchorCoord, [
              deltaX,
              deltaY,
            ]);
            const card = board.getCard(x, y);

            const isPossibleSlot = possibleSlots.some(
              ([slotX, slotY]) => slotX === x && slotY === y,
            );

            const isHovered =
              hoveredCoord && hoveredCoord.x === x && hoveredCoord.y === y;

            return (
              <BoardSlot
                x={x}
                y={y}
                card={card}
                isPossibleSlot={isPossibleSlot}
                isHovered={!!isHovered} // 추가
                style={{ gridRow: deltaY + 1, gridColumn: deltaX + 1 }}
                key={`${x}:${y}`}
              />
            );
          }),
        )}
      </section>

      <p>화살표로 보드판 이동, esc로 기본 위치로 이동</p>
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
  isHovered,
  style,
  className,
}: {
  x: number;
  y: number;
  card: SaboteurCard.Path.Abstract | null;
  isPossibleSlot?: boolean;
  isHovered?: boolean; // 추가
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
        "relative flex snap-center items-center justify-center",
        (x + y) % 2 === 0 ? "bg-base-300/10" : "bg-base-300/30",
        !isHovered && "border border-gray-300",
        className,
      )}
    >
      {/* 카드 */}
      {card && <Card card={card} size={CARD_WIDTH} fixed />}
      {/* 호버 오버레이 */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded border-4 border-yellow-400"
          style={{ boxSizing: "border-box" }}
        />
      )}
      {/* 가능한 슬롯 표시 */}
      {isPossibleSlot && (
        <div
          className="absolute inset-0 border-2 border-dashed border-yellow-300 bg-gray-800"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
};
