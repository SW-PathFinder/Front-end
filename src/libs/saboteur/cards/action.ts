import { AbstractCard } from "@/libs/saboteur/cards/base";
import { Tools } from "@/libs/saboteur/types";

export namespace ActionCard {
  export abstract class Abstract
    extends AbstractCard
    implements AbstractCard.Playable
  {
    type = "action";
    playable = true as const;
  }
  const SABOTAGE_ACTION_CARD_ASSETS = {
    pickaxe: "/assets/saboteur/cards/action/sabotage_p.png",
    lantern: "/assets/saboteur/cards/action/sabotage_l.png",
    mineCart: "/assets/saboteur/cards/action/sabotage_w.png",
  };
  export class Sabotage extends ActionCard.Abstract {
    readonly tool: [Tools];
    readonly image: string;

    constructor(tool: Tools) {
      super();
      this.tool = [tool];
      this.image = SABOTAGE_ACTION_CARD_ASSETS[tool];
    }
  }

  type AvailableRepairToolSet =
    | [Tools.Pickaxe]
    | [Tools.Lantern]
    | [Tools.MineCart]
    | [Tools.Pickaxe, Tools.Lantern]
    | [Tools.Pickaxe, Tools.MineCart]
    | [Tools.Lantern, Tools.MineCart];

  export class Repair extends ActionCard.Abstract {
    readonly tools: AvailableRepairToolSet;
    readonly image: string;

    constructor(tools: AvailableRepairToolSet) {
      super();
      this.tools = tools;
      this.image = `/assets/saboteur/cards/action/repair_${tools.map((tool) => tool[0].toLowerCase()).join("")}.png`;
    }
  }

  export class Map extends ActionCard.Abstract {
    image = "/assets/saboteur/cards/action/map.png";
  }

  export class Destroy extends ActionCard.Abstract {
    image = "/assets/saboteur/cards/action/destroy.png";
  }

  export type Cards = InstanceType<
    (typeof ActionCard)[keyof typeof ActionCard]
  >;
}
