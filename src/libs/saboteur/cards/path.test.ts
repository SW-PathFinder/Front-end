import { describe, expect, it } from "vitest";

import { CardinalDirection, SaboteurCard } from "@/libs/saboteur/cards";

const flipMap = {
  [CardinalDirection.East]: CardinalDirection.West,
  [CardinalDirection.West]: CardinalDirection.East,
  [CardinalDirection.South]: CardinalDirection.North,
  [CardinalDirection.North]: CardinalDirection.South,
} as const;

describe("opened direction", () => {
  const edges = [
    [SaboteurCard.Path.Way4, CardinalDirection.East, true],
    [SaboteurCard.Path.Way4, CardinalDirection.West, true],
    [SaboteurCard.Path.Way4, CardinalDirection.South, true],
    [SaboteurCard.Path.Way4, CardinalDirection.North, true],

    [SaboteurCard.Path.Way2A, CardinalDirection.East, true],
    [SaboteurCard.Path.Way2A, CardinalDirection.West, false],
    [SaboteurCard.Path.Way2A, CardinalDirection.South, true],
    [SaboteurCard.Path.Way2A, CardinalDirection.North, false],

    [SaboteurCard.Path.Block2A, CardinalDirection.East, true],
    [SaboteurCard.Path.Block2A, CardinalDirection.West, false],
    [SaboteurCard.Path.Block2A, CardinalDirection.South, true],
    [SaboteurCard.Path.Block2A, CardinalDirection.North, false],
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
    const card = new SaboteurCard.Path.Way2A();

    expect(card.isConnected(from, to)).toBe(result);
  });

  it.each(edges)("can consider weather flipped or not", (from, to, result) => {
    const card = new SaboteurCard.Path.Way2A();
    card.flipped = true;

    expect(card.isConnected(flipMap[from], flipMap[to])).toBe(result);
  });
});
