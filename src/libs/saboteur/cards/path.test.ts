import { describe, expect, it } from "vitest";

import { CardinalDirection, PathCard } from "@/libs/saboteur/cards/path";

const flipMap = {
  [CardinalDirection.East]: CardinalDirection.West,
  [CardinalDirection.West]: CardinalDirection.East,
  [CardinalDirection.South]: CardinalDirection.North,
  [CardinalDirection.North]: CardinalDirection.South,
};

describe("PathCard", () => {
  describe("opened direction", () => {
    const edges = [
      [PathCard.Way4, CardinalDirection.East, true],
      [PathCard.Way4, CardinalDirection.West, true],
      [PathCard.Way4, CardinalDirection.South, true],
      [PathCard.Way4, CardinalDirection.North, true],

      [PathCard.Way2A, CardinalDirection.East, true],
      [PathCard.Way2A, CardinalDirection.West, false],
      [PathCard.Way2A, CardinalDirection.South, true],
      [PathCard.Way2A, CardinalDirection.North, false],

      [PathCard.Block2A, CardinalDirection.East, true],
      [PathCard.Block2A, CardinalDirection.West, false],
      [PathCard.Block2A, CardinalDirection.South, true],
      [PathCard.Block2A, CardinalDirection.North, false],
    ] as const;

    it.each(edges)("can check opened direction", (cls, direction, expected) => {
      const card = new cls();
      expect(card.isOpen(direction)).toBe(expected);
    });

    it.each(edges)(
      "can consider weather flipped or not",
      (cls, direction, expected) => {
        const card = new cls();

        card.flipped = true;

        expect(card.isOpen(flipMap[direction])).toBe(expected);
      },
    );
  });

  describe("connection check", () => {
    const edges = [
      [CardinalDirection.East, CardinalDirection.West, false],
      [CardinalDirection.East, CardinalDirection.South, true],
      [CardinalDirection.South, CardinalDirection.East, true],
      [CardinalDirection.East, CardinalDirection.North, false],
      [CardinalDirection.West, CardinalDirection.South, false],
      [CardinalDirection.West, CardinalDirection.North, false],
      [CardinalDirection.South, CardinalDirection.North, false],
    ] as const;
    it.each(edges)("can check connected direction", (from, to, result) => {
      const card = new PathCard.Way2A();

      expect(card.isConnected(from, to)).toBe(result);
    });

    it.each(edges)(
      "can consider weather flipped or not",
      (from, to, result) => {
        const card = new PathCard.Way2A();
        card.flipped = true;

        expect(card.isConnected(flipMap[from], flipMap[to])).toBe(result);
      },
    );
  });
});
