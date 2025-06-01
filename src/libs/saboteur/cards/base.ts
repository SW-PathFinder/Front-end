export abstract class BaseCard {
  private static uid_counter = 1;

  readonly id: number;

  abstract readonly type: string;
  abstract readonly image: string;
  abstract readonly playable: boolean;

  constructor() {
    this.id = BaseCard.uid_counter++;
  }
}

export namespace BaseCard {
  export interface Playable extends BaseCard {
    playable: true;
  }

  export interface NonPlayable extends BaseCard {
    playable: false;
  }
}

export class HiddenCard extends BaseCard implements BaseCard.Playable {
  type = "hidden";
  image = "/cards/bg_playable.png";
  playable = true as const;
}
