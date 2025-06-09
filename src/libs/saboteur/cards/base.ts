export abstract class AbstractCard {
  private static uid_counter = 1;
  readonly uid = `${AbstractCard.uid_counter++}`;

  abstract readonly type: string;
  abstract readonly image: string;
  abstract readonly playable: boolean;

  // isCloneOf<T extends AbstractCard>(card: T): card is T {
  //   return this.uid === card.uid;
  // }

  isSame(card: AbstractCard): card is AbstractCard {
    return this.type === card.type && this.constructor === card.constructor;
  }
}

export namespace AbstractCard {
  export interface Playable extends AbstractCard {
    playable: true;
  }

  export interface NonPlayable extends AbstractCard {
    playable: false;
  }
}

export class HiddenCard extends AbstractCard {
  type = "hidden";
  image = "/assets/saboteur/cards/bg_playable.png";
  playable = false as const;
}
