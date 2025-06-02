import { AbstractCard } from "@/libs/saboteur/cards/base";

export enum CardinalDirection {
  East = "east",
  West = "west",
  South = "south",
  North = "north",
}

export namespace PathCard {
  function flipDirection(direction: CardinalDirection): CardinalDirection {
    switch (direction) {
      case CardinalDirection.East:
        return CardinalDirection.West;
      case CardinalDirection.West:
        return CardinalDirection.East;
      case CardinalDirection.South:
        return CardinalDirection.North;
      case CardinalDirection.North:
        return CardinalDirection.South;
    }
  }

  export abstract class Abstract extends AbstractCard {
    type = "path";
    flipped: boolean = false;
    abstract readonly destructible: boolean;

    protected abstract readonly _subsets: readonly (readonly CardinalDirection[])[];

    private get subsets(): readonly (readonly CardinalDirection[])[] {
      if (!this.flipped) return this._subsets;
      return this._subsets.map((subset) => subset.map(flipDirection));
    }

    private get openDirections(): readonly CardinalDirection[] {
      return this.subsets.flatMap((subset) => subset);
    }

    isOpen(direction: CardinalDirection): boolean {
      return this.openDirections.includes(direction);
    }

    isConnected(from: CardinalDirection, to: CardinalDirection): boolean {
      return this.subsets.some(
        (subset) => subset.includes(from) && subset.includes(to),
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
    protected _subsets = [
      [
        CardinalDirection.East,
        CardinalDirection.West,
        CardinalDirection.South,
        CardinalDirection.North,
      ],
    ] as const;
  }

  export class Block4 extends AbstractCommon {
    image = "/assets/saboteur/cards/path/4block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.West],
      [CardinalDirection.South],
      [CardinalDirection.North],
    ] as const;
  }

  export class Way3A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3a_way.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.West, CardinalDirection.South],
    ] as const;
  }

  export class Block3A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3a_block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.West],
      [CardinalDirection.South],
    ] as const;
  }

  export class Way3B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3b_way.png";
    protected _subsets = [
      [
        CardinalDirection.East,
        CardinalDirection.South,
        CardinalDirection.North,
      ],
    ] as const;
  }

  export class Block3B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/3b_block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.South],
      [CardinalDirection.North],
    ] as const;
  }

  export class Way2A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2a_way.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.South],
    ] as const;
  }

  export class Block2A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2a_block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.South],
    ] as const;
  }

  export class Way2B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2b_way.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.North],
    ] as const;
  }

  export class Block2B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2b_block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.North],
    ] as const;
  }

  export class Way2C extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2c_way.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.West],
    ] as const;
  }

  export class Block2C extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2c_block.png";
    protected _subsets = [
      [CardinalDirection.East],
      [CardinalDirection.West],
    ] as const;
  }

  export class Way2D extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2d_way.png";
    protected _subsets = [
      [CardinalDirection.South, CardinalDirection.North],
    ] as const;
  }

  export class Block2D extends AbstractCommon {
    image = "/assets/saboteur/cards/path/2d_block.png";
    protected _subsets = [
      [CardinalDirection.South],
      [CardinalDirection.North],
    ] as const;
  }

  export class Block1A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1a_block.png";
    protected _subsets = [[CardinalDirection.East]] as const;
  }

  export class Block1B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1b_block.png";
    protected _subsets = [[CardinalDirection.South]] as const;
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
    protected _subsets = [
      [
        CardinalDirection.East,
        CardinalDirection.West,
        CardinalDirection.South,
        CardinalDirection.North,
      ],
    ] as const;
  }

  export abstract class AbstractDest extends AbstractSpecial {
    type = "dest";
  }

  export class DestHidden extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_hidden.png";
    protected _subsets = [
      [
        CardinalDirection.East,
        CardinalDirection.West,
        CardinalDirection.South,
        CardinalDirection.North,
      ],
    ] as const;
  }

  export class DestGold extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_gold.png";
    protected _subsets = [
      [
        CardinalDirection.East,
        CardinalDirection.West,
        CardinalDirection.South,
        CardinalDirection.North,
      ],
    ] as const;
  }

  export class DestRockA extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_a.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.South],
    ] as const;
  }

  export class DestRockB extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_b.png";
    protected _subsets = [
      [CardinalDirection.East, CardinalDirection.North],
    ] as const;
  }
}
