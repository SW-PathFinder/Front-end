export abstract class Card {
  abstract readonly type: string;
  abstract readonly image: string;
}

export class HiddenCard extends Card {
  type = "hidden";
  image = "/cards/hidden.png";
}
