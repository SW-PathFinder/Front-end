import { AbstractCard } from "@/libs/saboteur/cards/base";

export namespace CardinalDirection {
  export const East = 0b0001;
  export const South = 0b0010;
  export const West = 0b0100;
  export const North = 0b1000;

  export const adjacentList = [East, South, West, North] as const;
  export type Adjacent =
    | typeof East
    | typeof South
    | typeof West
    | typeof North;

  export const None = 0b0000;
  export const All = 0b1111;

  export type Defined = Adjacent | typeof All | typeof None;

  export type Any = Defined | (number & { _any?: true });

  export function rotateHalf(direction: Adjacent): Adjacent;
  export function rotateHalf(direction: Any): Any;
  export function rotateHalf(direction: Any) {
    return ((direction << 2) & 0b1100) | ((direction >> 2) & 0b0011);
  }

  export function includes(subset: Any, direction: Any): boolean {
    return (direction & subset) === subset;
  }

  export function toCoordinateDiff(direction: Adjacent): [number, number] {
    switch (direction) {
      case East:
        return [1, 0];
      case South:
        return [0, 1];
      case West:
        return [-1, 0];
      case North:
        return [0, -1];
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  }

  export function moveCoordinates(
    coordinates: [number, number],
    direction: Adjacent,
  ): [number, number] {
    const [x, y] = coordinates;
    const [dx, dy] = toCoordinateDiff(direction);
    return [x + dx, y + dy];
  }

  export function extractDirections(
    directions: Any,
  ): CardinalDirection.Adjacent[] {
    return CardinalDirection.adjacentList.filter(
      (adjacent) => directions & adjacent,
    );
  }

  export function toString(direction: Defined): string {
    switch (direction) {
      case East:
        return "동쪽";
      case South:
        return "남쪽";
      case West:
        return "서쪽";
      case North:
        return "북쪽";
      case All:
        return "모든 방향";
      case None:
        return "연결되지 않음";
      default:
        return `방향(${direction})`;
    }
  }
}
type CardinalDirection = CardinalDirection.Any;

export namespace PathCard {
  export abstract class Abstract extends AbstractCard {
    type = "path";
    flipped: boolean;
    abstract readonly destructible: boolean;

    protected abstract readonly _roads: readonly CardinalDirection[];

    constructor(flipped: boolean = false) {
      super();
      this.flipped = flipped;
    }

    protected get roads(): readonly CardinalDirection[] {
      if (!this.flipped) return this._roads;
      return this._roads.map(CardinalDirection.rotateHalf);
    }

    private get openDirections(): CardinalDirection {
      return this.roads.reduce(
        (acc, subset) => acc | subset,
        CardinalDirection.None,
      );
    }

    isOpen(direction: CardinalDirection.Adjacent): boolean {
      return !!(this.openDirections & direction);
    }

    isConnected(
      from: CardinalDirection.Any,
      to: CardinalDirection.Any,
    ): boolean {
      return this.roads.some((subset) =>
        CardinalDirection.includes(subset, from | to),
      );
    }

    canConnectWith(
      card: PathCard.Abstract,
      direction: CardinalDirection.Adjacent,
    ): boolean {
      return (
        this.isOpen(direction) &&
        card.isOpen(CardinalDirection.rotateHalf(direction))
      );
    }
  }

  export abstract class AbstractCommon
    extends PathCard.Abstract
    implements AbstractCard.Playable
  {
    destructible = true;
    playable = true as const;
  }

  export class Way4 extends AbstractCommon {
    image = "/assets/saboteur/cards/path/4way.png";
    protected _roads = [CardinalDirection.All] as const;
  }

  export class Block4 extends AbstractCommon {
    image = "/assets/saboteur/cards/path/4block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Way3A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3a_way.png";
    protected _roads = [
      CardinalDirection.All ^ CardinalDirection.North,
    ] as const;
  }

  export class Block3A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3a_block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
      CardinalDirection.South,
    ] as const;
  }

  export class Way3B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3b_way.png";
    protected _roads = [
      CardinalDirection.All ^ CardinalDirection.West,
    ] as const;
  }

  export class Block3B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3b_block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Way2A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2a_way.png";
    protected _roads = [
      CardinalDirection.East | CardinalDirection.South,
    ] as const;
  }

  export class Block2A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2a_block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.South,
    ] as const;
  }

  export class Way2B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2b_way.png";
    protected _roads = [
      CardinalDirection.East | CardinalDirection.North,
    ] as const;
  }

  export class Block2B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2b_block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.North,
    ] as const;
  }

  export class Way2C extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2c_way.png";
    protected _roads = [
      CardinalDirection.East | CardinalDirection.West,
    ] as const;
  }

  export class Block2C extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2c_block.png";
    protected _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
    ] as const;
  }

  export class Way2D extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2d_way.png";
    protected _roads = [
      CardinalDirection.South | CardinalDirection.North,
    ] as const;
  }

  export class Block2D extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2d_block.png";
    protected _roads = [
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Block1A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1a_block.png";
    protected _roads = [CardinalDirection.East] as const;
  }

  export class Block1B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1b_block.png";
    protected _roads = [CardinalDirection.South] as const;
  }

  export abstract class AbstractSpecial
    extends PathCard.Abstract
    implements AbstractCard.NonPlayable
  {
    destructible = false;
    playable = false as const;
  }

  export class Origin extends AbstractSpecial {
    type = "origin";
    image = "/assets/saboteur/cards/path/origin.png";
    protected _roads = [CardinalDirection.All] as const;
  }

  export abstract class AbstractDest extends AbstractSpecial {
    type = "dest";
  }

  export class DestHidden extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_hidden.png";
    protected _roads = [CardinalDirection.All] as const;
  }

  export class DestGold extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_gold.png";
    protected _roads = [CardinalDirection.All] as const;
  }

  export class DestRockA extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_a.png";
    protected _roads = [
      CardinalDirection.East | CardinalDirection.South,
    ] as const;
  }

  export class DestRockB extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_b.png";
    protected _roads = [
      CardinalDirection.East | CardinalDirection.North,
    ] as const;
  }
}
