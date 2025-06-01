import { AbstractCard } from "@/libs/saboteur/cards/base";
import { Tools } from "@/libs/saboteur/types";

export abstract class AbstractActionCard
  extends AbstractCard
  implements AbstractCard.Playable
{
  type = "action";
  playable = true as const;
}

const SABOTAGE_ACTION_CARD_ASSETS = {
  pickaxe: "/assets/saboteur/cards/action/sabotage_p.png",
  lantern: "/assets/saboteur/cards/action/sabotage_l.png",
  wagon: "/assets/saboteur/cards/action/sabotage_w.png",
};
export class SabotageActionCard extends AbstractActionCard {
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

export class RepairActionCard extends AbstractActionCard {
  readonly tools: AvailableRepairToolSet;
  readonly image: string;

  constructor(tools: AvailableRepairToolSet) {
    super();
    this.tools = tools;
    this.image = `/assets/saboteur/cards/action/repair_${tools.map((tool) => tool[0].toLowerCase()).join("")}.png`;
  }
}

export class MapActionCard extends AbstractActionCard {
  image = "/assets/saboteur/cards/action/map.png";
}

export class DestroyActionCard extends AbstractActionCard {
  image = "/assets/saboteur/cards/action/destroy.png";
}
