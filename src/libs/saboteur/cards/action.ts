import { BaseCard } from "@/libs/saboteur/cards/base";

export abstract class ActionCard extends BaseCard implements BaseCard.Playable {
  type = "action";
  abstract readonly playable: true;
}
