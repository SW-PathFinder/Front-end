import { AbstractCard } from "@/libs/saboteur/cards/base";

export abstract class AbstractPathCard extends AbstractCard {
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
  get direction() {
    if (!this.flipped) return this._direction;

    return [
      this._direction[1],
      this._direction[0],
      this._direction[3],
      this._direction[2],
    ] as const;
  }
}

abstract class AbstractDestructiblePathCard
  extends AbstractPathCard
  implements AbstractCard.Playable
{
  destructible = true;
  playable = true as const;
}

abstract class PathCard4Base extends AbstractDestructiblePathCard {
  _direction = [true, true, true, true] as const;
}

export class PathCard4Way extends PathCard4Base {
  image = "/cards/path/4way.png";
  blocked = false;
}

export class PathCard4Block extends PathCard4Way {
  image = "/cards/path/4block.png";
  blocked = true;
}

abstract class PathCard3ABase extends AbstractDestructiblePathCard {
  _direction = [true, true, true, false] as const;
}
export class PathCard3AWay extends PathCard3ABase {
  image = "/cards/path/3a_way.png";
  blocked = false;
}
export class PathCard3ABlock extends PathCard3ABase {
  image = "/cards/path/3a_block.png";
  blocked = true;
}

abstract class PathCard3BBase extends AbstractDestructiblePathCard {
  _direction = [true, false, true, true] as const;
}
export class PathCard3BWay extends PathCard3BBase {
  image = "/cards/path/3b_way.png";
  blocked = false;
}
export class PathCard3BBlock extends PathCard3BBase {
  image = "/cards/path/3b_block.png";
  blocked = true;
}

abstract class PathCard2ABase extends AbstractDestructiblePathCard {
  _direction = [true, false, true, false] as const;
}
export class PathCard2AWay extends PathCard2ABase {
  image = "/cards/path/2a_way.png";
  blocked = false;
}
export class PathCard2ABlock extends PathCard2ABase {
  image = "/cards/path/2a_block.png";
  blocked = true;
}

abstract class PathCard2BBase extends AbstractDestructiblePathCard {
  _direction = [true, false, false, true] as const;
}
export class PathCard2BWay extends PathCard2BBase {
  image = "/cards/path/2b_way.png";
  blocked = false;
}
export class PathCard2BBlock extends PathCard2BBase {
  image = "/cards/path/2b_block.png";
  blocked = true;
}

abstract class PathCard2CBase extends AbstractDestructiblePathCard {
  _direction = [true, true, false, false] as const;
}
export class PathCard2CWay extends PathCard2CBase {
  image = "/cards/path/2c_way.png";
  blocked = false;
}
export class PathCard2CBlock extends PathCard2CBase {
  image = "/cards/path/2c_block.png";
  blocked = true;
}

abstract class PathCard2DBase extends AbstractDestructiblePathCard {
  _direction = [false, false, true, true] as const;
}
export class PathCard2DWay extends PathCard2DBase {
  image = "/cards/path/2d_way.png";
  blocked = false;
}
export class PathCard2DBlock extends PathCard2DBase {
  image = "/cards/path/2d_block.png";
  blocked = true;
}

export class PathCard1ABlock extends AbstractDestructiblePathCard {
  image = "/cards/path/1a_block.png";
  blocked = true;
  _direction = [true, false, false, false] as const;
}

export class PathCard1BBlock extends AbstractDestructiblePathCard {
  image = "/cards/path/1b_block.png";
  blocked = true;
  _direction = [false, false, true, false] as const;
}

abstract class AbstractIndestructiblePathCard
  extends AbstractPathCard
  implements AbstractCard.NonPlayable
{
  destructible = false;
  playable = false as const;
}

export class PathCardOrigin extends AbstractIndestructiblePathCard {
  type = "origin";
  image = "/cards/path/origin.png";
  blocked = false;
  _direction = [true, true, true, true] as const;
}

abstract class PathCardDest extends AbstractIndestructiblePathCard {
  type = "dest";
  blocked = false;
}

export class PathCardDestHidden extends PathCardDest {
  image = "/cards/path/dest_hidden.png";
  _direction = [true, true, true, true] as const;
}

export class PathCardDestGold extends PathCardDest {
  image = "/cards/path/dest_gold.png";
  _direction = [true, true, true, true] as const;
}

export class PathCardDestRockA extends PathCardDest {
  image = "/cards/path/dest_rock_a.png";
  _direction = [true, false, true, false] as const;
}

export class PathCardDestRockB extends PathCardDest {
  image = "/cards/path/dest_rock_b.png";
  _direction = [true, false, false, true] as const;
}
