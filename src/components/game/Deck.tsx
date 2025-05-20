import { UniqueIdentifier } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { Card } from "./Card";

interface DeckProps {
  cards: { id: UniqueIdentifier; image: string }[];
  className?: string;
}

export const Deck = ({ cards, className }: DeckProps) => {
  return (
    <section
      className={twMerge(
        "flex h-28 w-96 items-center gap-2 border-2",
        className,
      )}
    >
      {cards.map((card, index) => (
        <Card card={card} key={index} />
      ))}
    </section>
  );
};
