import { useUniqueId } from "@dnd-kit/utilities";
import { twMerge } from "tailwind-merge";

import { Schema } from "@/types";

import { Card, CARD_HEIGHT, CARD_WIDTH } from "./Card";
import { Droppable } from "./Dnd";

interface HandProps {
  cards: Schema.Card[];
  className?: string;
}

export const Hand = ({ cards, className }: HandProps) => {
  const id = useUniqueId("hand");

  return (
    <Droppable id={id} className={twMerge("relative w-16", className)}>
      {cards.map((card, index) => {
        const handTransform = getHandCardTransform(index, cards.length, {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        });

        return (
          <Card
            card={card}
            size={CARD_WIDTH}
            transform={handTransform}
            key={card.id}
          />
        );
      })}
    </Droppable>
  );
};

const MAX_CARDS = 6;
const MAX_DEGREE = 60;
const DEGREE_PER_CARD = MAX_DEGREE / MAX_CARDS;

interface HandCardTransform {
  x: number;
  y: number;
  rotate: number;
}

function getHandCardTransform(
  index: number,
  handLength: number,
  { height }: Pick<DOMRect, "width" | "height">,
): HandCardTransform {
  const relativeIndex = index - (handLength - 1) / 2;
  const degree = DEGREE_PER_CARD * relativeIndex;
  const theta = (degree * Math.PI) / 180;
  const radius = height * 2;
  // const x = radius * Math.sin(theta) - relativeIndex * width;
  const x = radius * Math.sin(theta);
  const y = radius - radius * Math.cos(theta);

  return { x, y, rotate: degree };
}
