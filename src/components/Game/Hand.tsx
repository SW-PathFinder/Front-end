import { useUniqueId } from "@dnd-kit/utilities";
import { twMerge } from "tailwind-merge";

import { SaboteurCard } from "@/libs/saboteur/cards";

import { Card, CARD_HEIGHT, CARD_WIDTH } from "./Card";
import { Droppable } from "./Dnd";

interface HandProps {
  cards: readonly SaboteurCard.Abstract.Playable[];
  className?: string;
}

export const Hand = ({ cards, className }: HandProps) => {
  const id = useUniqueId("hand");

  return (
    <Droppable
      id={id}
      style={{}}
      className={twMerge("relative flex justify-center", className)}
    >
      {cards.map((card, index) => {
        const handTransform = getHandCardTransform(index, cards.length, {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        });

        return (
          <div
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            className="relative"
            key={card.uid}
          >
            <Card card={card} size={CARD_WIDTH} transform={handTransform} />
          </div>
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
  const x = radius * Math.sin(theta) - relativeIndex * CARD_WIDTH;
  const y = radius - radius * Math.cos(theta);

  return { x, y, rotate: degree };
}
