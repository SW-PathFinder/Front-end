import { Tools } from "../types";
import { AbstractCard } from "./base";

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
    mineCart: "/assets/saboteur/cards/action/sabotage_m.png",
  };
  export class Sabotage extends ActionCard.Abstract {
    readonly tool: [Tools];
    readonly image: string;

    constructor(tool: Tools) {
      super();
      this.tool = [tool];
      this.image = SABOTAGE_ACTION_CARD_ASSETS[tool];
    }

    isSame(card: AbstractCard): card is Sabotage {
      return (
        super.isSame(card) &&
        card instanceof Sabotage &&
        this.tool[0] === card.tool[0]
      );
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

    constructor(tools: Tools[]) {
      super();
      this.tools = tools.sort((a, b) =>
        a === Tools.Pickaxe
          ? -1
          : a === Tools.Lantern
            ? b === Tools.MineCart
              ? -1
              : 1
            : 1,
      ) as AvailableRepairToolSet;
      this.image = `/assets/saboteur/cards/action/repair_${tools.map((tool) => tool[0].toLowerCase()).join("")}.png`;
    }

    isSame(card: AbstractCard): card is Repair {
      return (
        super.isSame(card) &&
        card instanceof Repair &&
        this.tools.length === card.tools.length &&
        this.tools.every((tool, index) => tool === card.tools[index])
      );
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
