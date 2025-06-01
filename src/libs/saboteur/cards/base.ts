export abstract class AbstractCard {
  private static uid_counter = 1;

  readonly id: number;

  abstract readonly type: string;
  abstract readonly image: string;
  abstract readonly playable: boolean;

  constructor() {
    this.id = AbstractCard.uid_counter++;
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

export class HiddenCard extends AbstractCard implements AbstractCard.Playable {
  type = "hidden";
  image = "/cards/bg_playable.png";
  playable = true as const;
}
