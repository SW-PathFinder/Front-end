export enum Tools {
  Lantern = "lantern",
  Wagon = "wagon",
  Pickaxe = "pickaxe",
}

export namespace Schema {
  export interface Player {
    id: number;
    name: string;
    status: Record<Tools, boolean>;
    hand: number;
    winning?: boolean;
  }
}
