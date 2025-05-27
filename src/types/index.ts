import { UniqueIdentifier } from "@dnd-kit/core";

import { Tools } from "@/libs/gameLogics";

export namespace Schema {
  export interface Card {
    id: UniqueIdentifier;
    image: string;
    flipped?: boolean;
  }
}

export interface DummyInterface {
  id: number;
  name: string;
  status: Record<Tools, boolean>;
  hand: number;
  winning?: boolean;
}
