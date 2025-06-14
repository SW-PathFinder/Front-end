import { AbstractCard } from "./base";
import { CardinalDirection } from "./direction";

export namespace PathCard {
  export abstract class Abstract extends AbstractCard {
    type = "path";

    abstract readonly destructible: boolean;
    protected abstract readonly _roads: readonly CardinalDirection[];
    protected abstract readonly _images: string[];
    private imageIdx: number | null = null;

    flipped: boolean;

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

    get image() {
      if (!this.imageIdx)
        this.imageIdx = Math.floor(Math.random() * this._images.length);
      return this._images[this.imageIdx];
    }

    isOpen(direction: CardinalDirection.Adjacent): boolean {
      return !!(this.openDirections & direction);
    }

    isConnected(
      from: CardinalDirection.Adjacent,
      to: CardinalDirection.Any | CardinalDirection.Some,
    ): boolean {
      if (to === CardinalDirection.Some) {
        return this.roads.some(
          (subset) =>
            CardinalDirection.includes(subset, from) &&
            CardinalDirection.remove(subset, from),
        );
      }
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

    get stringForm(): string {
      return this.toString();
    }

    toString(): string {
      return [
        `-----------`,
        `|    ${this.isOpen(CardinalDirection.North) ? "|" : " "}    |`,
        `|    ${this.isOpen(CardinalDirection.North) && this.isConnected(CardinalDirection.North, CardinalDirection.Some) ? "|" : " "}    |`,
        `|${this.isOpen(CardinalDirection.West) ? "--" : "  "}${this.isOpen(CardinalDirection.West) && this.isConnected(CardinalDirection.West, CardinalDirection.Some) ? "--" : "  "}.${this.isOpen(CardinalDirection.East) && this.isConnected(CardinalDirection.East, CardinalDirection.Some) ? "--" : "  "}${this.isOpen(CardinalDirection.East) ? "--" : "  "}|`,
        `|    ${this.isOpen(CardinalDirection.South) && this.isConnected(CardinalDirection.South, CardinalDirection.Some) ? "|" : " "}    |`,
        `|    ${this.isOpen(CardinalDirection.South) ? "|" : " "}    |`,
        `-----------`,
      ].join("\n");
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
    protected readonly _images = [
      "/assets/saboteur/cards/path/16.png",
      "/assets/saboteur/cards/path/17.png",
      "/assets/saboteur/cards/path/25.png",
      "/assets/saboteur/cards/path/26.png",
      "/assets/saboteur/cards/path/28.png",
    ];
    protected readonly _roads = [CardinalDirection.All] as const;
  }

  export class Block4 extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/15.png"];
    protected readonly _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Way3A extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/1.png",
      "/assets/saboteur/cards/path/34.png",
      "/assets/saboteur/cards/path/36.png",
      "/assets/saboteur/cards/path/37.png",
      "/assets/saboteur/cards/path/39.png",
    ];
    protected readonly _roads = [
      CardinalDirection.All ^ CardinalDirection.South,
    ] as const;
  }

  export class Block3A extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/38.png"];
    protected readonly _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
      CardinalDirection.North,
    ] as const;
  }

  export class Way3B extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/13.png",
      "/assets/saboteur/cards/path/18.png",
      "/assets/saboteur/cards/path/19.png",
      "/assets/saboteur/cards/path/21.png",
      "/assets/saboteur/cards/path/30.png",
    ];
    protected readonly _roads = [
      CardinalDirection.All ^ CardinalDirection.West,
    ] as const;
  }

  export class Block3B extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/29.png"];
    protected readonly _roads = [
      CardinalDirection.East,
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Way2A extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/0.png",
      "/assets/saboteur/cards/path/3.png",
      "/assets/saboteur/cards/path/40.png",
      "/assets/saboteur/cards/path/43.png",
    ];
    protected readonly _roads = [
      CardinalDirection.West | CardinalDirection.North,
    ] as const;
  }

  export class Block2A extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/5.png"];
    protected readonly _roads = [
      CardinalDirection.West,
      CardinalDirection.North,
    ] as const;
  }

  export class Way2B extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/4.png",
      "/assets/saboteur/cards/path/10.png",
      "/assets/saboteur/cards/path/24.png",
      "/assets/saboteur/cards/path/33.png",
      "/assets/saboteur/cards/path/41.png",
    ];
    protected readonly _roads = [
      CardinalDirection.East | CardinalDirection.North,
    ] as const;
  }

  export class Block2B extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/2.png"];
    protected readonly _roads = [
      CardinalDirection.East,
      CardinalDirection.North,
    ] as const;
  }

  export class Way2C extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/9.png",
      "/assets/saboteur/cards/path/20.png",
      "/assets/saboteur/cards/path/35.png",
    ];
    protected readonly _roads = [
      CardinalDirection.East | CardinalDirection.West,
    ] as const;
  }

  export class Block2C extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/42.png"];
    protected readonly _roads = [
      CardinalDirection.East,
      CardinalDirection.West,
    ] as const;
  }

  export class Way2D extends AbstractCommon {
    protected readonly _images = [
      "/assets/saboteur/cards/path/11.png",
      "/assets/saboteur/cards/path/12.png",
      "/assets/saboteur/cards/path/22.png",
      "/assets/saboteur/cards/path/23.png",
    ];
    protected readonly _roads = [
      CardinalDirection.South | CardinalDirection.North,
    ] as const;
  }

  export class Block2D extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/32.png"];
    protected readonly _roads = [
      CardinalDirection.South,
      CardinalDirection.North,
    ] as const;
  }

  export class Block1A extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/31.png"];
    protected readonly _roads = [CardinalDirection.East] as const;
  }

  export class Block1B extends AbstractCommon {
    protected readonly _images = ["/assets/saboteur/cards/path/7.png"];
    protected readonly _roads = [CardinalDirection.North] as const;
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
    protected readonly _images = ["/assets/saboteur/cards/path/27.png"];
    protected readonly _roads = [CardinalDirection.All] as const;
  }

  export abstract class AbstractDest extends AbstractSpecial {
    type = "dest";
    hidden: boolean;
    bgImage = "/assets/saboteur/cards/bg_playable.png";

    constructor(flipped: boolean = false, hidden: boolean = false) {
      super(flipped);
      this.hidden = hidden;
    }
  }

  export class DestHidden extends AbstractDest {
    protected readonly _images = ["/assets/saboteur/cards/bg_playable.png"];
    protected readonly _roads = [CardinalDirection.All] as const;

    constructor(flipped: boolean = false) {
      super(flipped, true);
    }
  }

  export class DestGold extends AbstractDest {
    protected readonly _images = ["/assets/saboteur/cards/path/14.png"];
    protected readonly _roads = [CardinalDirection.All] as const;
  }

  export class DestRockA extends AbstractDest {
    protected readonly _images = ["/assets/saboteur/cards/path/8.png"];
    protected readonly _roads = [
      CardinalDirection.East | CardinalDirection.South,
    ] as const;
  }

  export class DestRockB extends AbstractDest {
    protected readonly _images = ["/assets/saboteur/cards/path/6.png"];
    protected readonly _roads = [
      CardinalDirection.East | CardinalDirection.North,
    ] as const;
  }

  export type Cards = InstanceType<(typeof PathCard)[keyof typeof PathCard]>;
}
