import { AbstractCard } from "@/libs/saboteur/cards/base";

export namespace CardinalDirection {
  export const None = 0b0000;
  export const East = 0b0001;
  export const South = 0b0010;
  export const West = 0b0100;
  export const North = 0b1000;
  export const All = 0b1111;

  export type Any =
    | typeof East
    | typeof South
    | typeof West
    | typeof North
    | typeof All
    | typeof None
    | (number & { _any?: true });

  export function rotateHalf(direction: number) {
    return ((direction << 2) & 0b1100) | ((direction >> 2) & 0b0011);
  }

  export function includes(subset: Any, direction: Any): boolean {
    return (direction & subset) === subset;
  }
}
type CardinalDirection = CardinalDirection.Any;

export namespace PathCard {
  export abstract class Abstract extends AbstractCard {
    type = "path";
    flipped: boolean = false;
    abstract readonly destructible: boolean;

    protected abstract readonly _roads: readonly CardinalDirection[];

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

    isOpen(direction: CardinalDirection): boolean {
      return !!(this.openDirections & direction);
    }

    isConnected(from: CardinalDirection, to: CardinalDirection): boolean {
      return this.roads.some((subset) =>
        CardinalDirection.includes(subset, from | to),
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
