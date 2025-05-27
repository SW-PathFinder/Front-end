import { useEffect, useRef } from "react";

import { twMerge } from "tailwind-merge";

import { Schema } from "@/types";

import { Card, CARD_HEIGHT, CARD_WIDTH } from "./Card";
import { Droppable } from "./Dnd";

interface BoardProps {
  cards: (Schema.Card | null)[][];
  style?: React.CSSProperties;
  className?: string;
}

export const BOARD_ROWS = 23;
export const BOARD_COLS = 23;

const BOARD_VISIBLE_ROWS = 7;
const BOARD_VISIBLE_COLS = 11;

// TODO: 카드 드래그할때 불필요한 스크롤링 방지
// 바깥 영역에서만 스크롤 한칸씩 되도록?
export const Board = ({ cards, style, className }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    boardRef.current.scrollTo({
      top: (CARD_HEIGHT * (BOARD_ROWS - BOARD_VISIBLE_ROWS)) / 2,
      left: (CARD_WIDTH * (BOARD_COLS - BOARD_VISIBLE_COLS)) / 2,
    });
  }, []);

  return (
    <section
      style={{
        // width: CARD_WIDTH * BOARD_VISIBLE_COLS,
        // height: CARD_HEIGHT * BOARD_VISIBLE_ROWS,
        gridTemplateColumns: `repeat(${BOARD_COLS}, ${CARD_WIDTH}px)`,
        gridTemplateRows: `repeat(${BOARD_ROWS}, ${CARD_HEIGHT}px)`,
        ...style,
      }}
      className={twMerge(
        "grid h-full w-full snap-both overflow-scroll pr-[175px] pb-[70px] pl-[184px]",
        className,
      )}
      ref={boardRef}
    >
      {Array.from({ length: BOARD_ROWS * BOARD_COLS }, (_, index) => {
        const x = Math.floor(index / BOARD_COLS);
        const y = index % BOARD_COLS;

        const id = `droppable:${x}:${y}`;

        const card = cards[x][y];

        return (
          <Droppable
            id={id}
            style={{ gridRow: x + 1, gridColumn: y + 1 }}
            className={`relative h-24 w-16 snap-center border border-gray-300 ${(x + y) % 2 === 0 ? "bg-base" : "bg-base-300"}`}
            key={id}
          >
            {/* {`${x},${y}`} */}
            {card && <Card card={card} size={CARD_WIDTH} fixed />}
          </Droppable>
        );
      })}
    </section>
  );
};
