export type Tools = "lantern" | "wagon" | "pick";

export namespace Schema {
  export interface Player {
    id: number;
    name: string;
    status: Record<Tools, boolean>;
    hand: number;
    winning?: boolean;
  }
}
