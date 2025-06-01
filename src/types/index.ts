import { UniqueIdentifier } from "@dnd-kit/core";

import { Tools } from "@/libs/gameLogics";

export namespace Schema {
  export namespace Card {
    export interface Base {
      id: UniqueIdentifier;
      image: string;
      type: string;
    }
    export interface Hidden extends Base {
      type: "hidden";
    }

    interface PathBase extends Base {
      type: "path";
      pathType: string;
      way: [boolean, boolean, boolean, boolean];
      destructible: boolean;
      flipped: boolean;
    }

    /**
     * @description 플레이어가 낼 수 있는 길 카드
     */
    export interface Road extends PathBase {
      pathType: "road";
      destructible: true;
    }

    export interface Start extends PathBase {
      pathType: "start";
      destructible: false;
    }

    interface DestinationBase extends PathBase {
      pathType: "dest";
      destructible: false;
      dest: string;
    }

    export interface Rock extends DestinationBase {
      dest: "rock";
    }
    export interface Gold extends DestinationBase {
      dest: "gold";
    }
    export type Destination = Rock | Gold;

    export type Path = Road | Start | Destination;

    interface ActionBase extends Base {
      type: "action";
      actionType: string;
    }

    export interface Sabotage extends ActionBase {
      actionType: "sabotage";
      tools: Tools[];
    }

    export interface Repair extends ActionBase {
      actionType: "repair";
      tools: Tools[];
    }
    export interface ViewMap extends ActionBase {
      actionType: "viewMap";
    }

    export interface RockFail extends ActionBase {
      actionType: "rockFail";
    }

    export type Action = Sabotage | Repair | ViewMap | RockFail;

    export type Any = Road | Start | Destination | Action;
  }

  export type Card = Card.Any;
}

export interface DummyInterface {
  id: number;
  name: string;
  status: Record<Tools, boolean>;
  hand: number;
  winning?: boolean;
}
