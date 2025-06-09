/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaboteurCard } from "@/libs/saboteur/cards";
import { Tools } from "@/libs/saboteur/types";

const cardIdToClassMap = {
  [-8]: [SaboteurCard.Path.DestHidden, false],
  [-7]: [SaboteurCard.Path.DestGold, false],
  // [-6]: [SaboteurCard.Path.DestGold, false],
  [-5]: [SaboteurCard.Path.DestRockA, false],
  // [-4]: [SaboteurCard.Path.DestRockA, false],
  [-3]: [SaboteurCard.Path.DestRockB, false],
  // [-2]: [SaboteurCard.Path.DestRockB, false],
  [-1]: [SaboteurCard.Path.Origin, false],
  1: [SaboteurCard.Path.Way2D, false],
  2: [SaboteurCard.Path.Way3B, false],
  3: [SaboteurCard.Path.Way4, false],
  4: [SaboteurCard.Path.Way3A, false],
  5: [SaboteurCard.Path.Way2C, false],
  6: [SaboteurCard.Path.Way2A, true],
  7: [SaboteurCard.Path.Way2B, false],
  8: [SaboteurCard.Path.Block1B, true],
  9: [SaboteurCard.Path.Block2D, false],
  10: [SaboteurCard.Path.Block3B, false],
  11: [SaboteurCard.Path.Block4, false],
  12: [SaboteurCard.Path.Block3A, true],
  13: [SaboteurCard.Path.Block2C, false],
  14: [SaboteurCard.Path.Block2A, true],
  15: [SaboteurCard.Path.Block2B, false],
  16: [SaboteurCard.Path.Block1A, false],
  17: [SaboteurCard.Action.Sabotage, Tools.MineCart],
  18: [SaboteurCard.Action.Sabotage, Tools.Lantern],
  19: [SaboteurCard.Action.Sabotage, Tools.Pickaxe],
  20: [SaboteurCard.Action.Repair, [Tools.MineCart]],
  21: [SaboteurCard.Action.Repair, [Tools.Lantern]],
  22: [SaboteurCard.Action.Repair, [Tools.Pickaxe]],
  23: [SaboteurCard.Action.Repair, [Tools.Lantern, Tools.MineCart]],
  24: [SaboteurCard.Action.Repair, [Tools.Pickaxe, Tools.MineCart]],
  25: [SaboteurCard.Action.Repair, [Tools.Pickaxe, Tools.Lantern]],
  26: [SaboteurCard.Action.Map],
  27: [SaboteurCard.Action.Destroy],
} as const;

export const defaultRotatedList = [
  SaboteurCard.Path.Way2A,
  SaboteurCard.Path.Block1B,
  SaboteurCard.Path.Block3A,
  SaboteurCard.Path.Block2A,
];

export type CardId = keyof typeof cardIdToClassMap;
export type PlayableCardId = Exclude<
  CardId,
  -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1
>;
export type CardIdToClassMap = typeof cardIdToClassMap;

export function transformIdToCard<T extends keyof CardIdToClassMap>(
  cardId: T | (number & {}),
  rotated?: boolean,
): InstanceType<CardIdToClassMap[T][0]> {
  const [constructor, ...params] = cardIdToClassMap[
    cardId as keyof typeof cardIdToClassMap
  ] as any;

  if (typeof params[0] === "boolean" && rotated)
    params[0] = params[0] !== rotated;

  return new constructor(...params);
}
