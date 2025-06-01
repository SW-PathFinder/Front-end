export abstract class BaseCard {
  private static uid = 1;

  readonly id: number;

  abstract readonly type: string;
  abstract readonly image: string;
  abstract readonly playable: boolean;

  constructor() {
    this.id = BaseCard.uid++;
  }
}

export namespace BaseCard {
  export interface Playable {
    playable: true;
  }

  export interface NonPlayable {
    playable: false;
  }
}

export class HiddenCard extends BaseCard implements BaseCard.Playable {
  type = "hidden";
  image = "/cards/bg_playable.png";
  playable = true as const;
}
