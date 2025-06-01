import { BaseCard } from "@/libs/saboteur/cards/base";
import { Tools } from "@/libs/saboteur/types";

export abstract class ActionCard extends BaseCard implements BaseCard.Playable {
  type = "action";
  playable = true as const;
}

const SABOTAGE_ACTION_CARD_ASSETS = {
  pickaxe: "/cards/action/sabotage_p.png",
  lantern: "/cards/action/sabotage_l.png",
  wagon: "/cards/action/sabotage_w.png",
};
export class SabotageActionCard extends ActionCard {
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
  | [Tools.Wagon]
  | [Tools.Pickaxe, Tools.Lantern]
  | [Tools.Pickaxe, Tools.Wagon]
  | [Tools.Lantern, Tools.Wagon];

export class RepairActionCard extends ActionCard {
  readonly tools: AvailableRepairToolSet;
  readonly image: string;

  constructor(tools: AvailableRepairToolSet) {
    super();
    this.tools = tools;
    this.image = `/cards/action/repair_${tools.map((tool) => tool[0].toLowerCase()).join("")}.png`;
  }
}

export class MapActionCard extends ActionCard {
  image = "/cards/action/map.png";
}

export class DestroyActionCard extends ActionCard {
  image = "/cards/action/destroy.png";
}
