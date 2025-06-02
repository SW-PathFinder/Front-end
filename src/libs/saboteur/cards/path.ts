import { AbstractCard } from "@/libs/saboteur/cards/base";

export enum CardinalDirection {
  East = "east",
  West = "west",
  South = "south",
  North = "north",
}

export namespace PathCard {
  export abstract class Abstract extends AbstractCard {
    type = "path";
    flipped: boolean = false;
    abstract readonly blocked: boolean;
    abstract readonly destructible: boolean;
    // 동, 서, 남, 북 방향을 나타내는 boolean 배열
    protected abstract readonly _direction: readonly [
      east: boolean,
      west: boolean,
      south: boolean,
      north: boolean,
    ];
    protected get direction() {
      if (!this.flipped) return this._direction;

      return [
        this._direction[1],
        this._direction[0],
        this._direction[3],
        this._direction[2],
      ] as const;
    }

    // protected abstract readonly subsets: Direction[][];

    isOpen(direction: CardinalDirection): boolean {
      switch (direction) {
        case CardinalDirection.East:
          return this.direction[0];
        case CardinalDirection.West:
          return this.direction[1];
        case CardinalDirection.South:
          return this.direction[2];
        case CardinalDirection.North:
          return this.direction[3];
        default:
          throw new Error("Invalid direction");
      }
    }

    isConnected(from: CardinalDirection, to: CardinalDirection): boolean {
      if (!this.isOpen(from) || !this.isOpen(to)) return false;
      if (this.blocked) return false;

      return true;
    }
  }

  export abstract class AbstractCommon
    extends PathCard.Abstract
    implements AbstractCard.Playable
  {
    destructible = true;
    playable = true as const;
  }

  abstract class Base4 extends AbstractCommon {
    _direction = [true, true, true, true] as const;
  }

  export class Way4 extends Base4 {
    image = "/assets/saboteur/cards/path/4way.png";
    blocked = false;
  }

  export class Block4 extends Base4 {
    image = "/assets/saboteur/cards/path/4block.png";
    blocked = true;
  }

  abstract class Base3A extends AbstractCommon {
    _direction = [true, true, true, false] as const;
  }
  export class Way3A extends Base3A {
    image = "/assets/saboteur/cards/path/3a_way.png";
    blocked = false;
  }
  export class Block3A extends Base3A {
    image = "/assets/saboteur/cards/path/3a_block.png";
    blocked = true;
  }

  abstract class Base3B extends AbstractCommon {
    _direction = [true, false, true, true] as const;
  }
  export class Way3B extends Base3B {
    image = "/assets/saboteur/cards/path/3b_way.png";
    blocked = false;
  }
  export class Block3B extends Base3B {
    image = "/assets/saboteur/cards/path/3b_block.png";
    blocked = true;
  }

  abstract class Base2A extends AbstractCommon {
    _direction = [true, false, true, false] as const;
  }
  export class Way2A extends Base2A {
    image = "/assets/saboteur/cards/path/2a_way.png";
    blocked = false;
  }
  export class Block2A extends Base2A {
    image = "/assets/saboteur/cards/path/2a_block.png";
    blocked = true;
  }

  abstract class Base2B extends AbstractCommon {
    _direction = [true, false, false, true] as const;
  }
  export class Way2B extends Base2B {
    image = "/assets/saboteur/cards/path/2b_way.png";
    blocked = false;
  }
  export class Block2B extends Base2B {
    image = "/assets/saboteur/cards/path/2b_block.png";
    blocked = true;
  }

  abstract class Base2C extends AbstractCommon {
    _direction = [true, true, false, false] as const;
  }
  export class Way2C extends Base2C {
    image = "/assets/saboteur/cards/path/2c_way.png";
    blocked = false;
  }
  export class Block2C extends Base2C {
    image = "/assets/saboteur/cards/path/2c_block.png";
    blocked = true;
  }

  abstract class Base2D extends AbstractCommon {
    _direction = [false, false, true, true] as const;
  }
  export class Way2D extends Base2D {
    image = "/assets/saboteur/cards/path/2d_way.png";
    blocked = false;
  }
  export class Block2D extends Base2D {
    image = "/assets/saboteur/cards/path/2d_block.png";
    blocked = true;
  }

  export class Block1A extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1a_block.png";
    blocked = true;
    _direction = [true, false, false, false] as const;
  }

  export class Block1B extends AbstractCommon {
    image = "/assets/saboteur/cards/path/1b_block.png";
    blocked = true;
    _direction = [false, false, true, false] as const;
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
    blocked = false;
    _direction = [true, true, true, true] as const;
  }

  export abstract class AbstractDest extends AbstractSpecial {
    type = "dest";
    blocked = false;
  }

  export class DestHidden extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_hidden.png";
    _direction = [true, true, true, true] as const;
  }

  export class DestGold extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_gold.png";
    _direction = [true, true, true, true] as const;
  }

  export class DestRockA extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_a.png";
    _direction = [true, false, true, false] as const;
  }

  export class DestRockB extends AbstractDest {
    image = "/assets/saboteur/cards/path/dest_rock_b.png";
    _direction = [true, false, false, true] as const;
  }
}
