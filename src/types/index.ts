import { UniqueIdentifier } from "@dnd-kit/core";

export namespace Schema {
  export interface Card {
    id: UniqueIdentifier;
    image: string;
    flipped?: boolean;
  }
}
