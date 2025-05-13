import { twMerge } from "tailwind-merge";
import { UniqueIdentifier } from "@dnd-kit/core";

import { Card } from "./Card";

interface DeckProps {
  cards: { id: UniqueIdentifier; image: string }[];
  className?: string;
}

export const Deck = ({ cards, className }: DeckProps) => {
  return (
    <section
      className={twMerge(
        "flex items-center gap-2 w-96 h-28 border-2",
        className,
      )}
    >
      {cards.map((card, index) => (
        <Card card={card} key={index} />
      ))}
    </section>
  );
};
