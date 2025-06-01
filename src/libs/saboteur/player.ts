import { BaseCard } from "@/libs/saboteur/cards";
import { Tools } from "@/libs/saboteur/types";

interface AbstractPlayerOption {
  name: string;
  status: Record<Tools, boolean>;
}

export abstract class AbstractPlayer {
  private static uid_counter = 1;
  readonly id: number = AbstractPlayer.uid_counter++;

  name: string;
  abstract readonly hand: number;
  readonly status: Record<Tools, boolean>;

  constructor({
    name,
    status = { lantern: true, pickaxe: true, wagon: false },
  }: AbstractPlayerOption) {
    this.name = name;
    this.status = status;
  }

  someToolIsAvailable(tools: Tools[]): boolean {
    return tools.some((tool) => this.status[tool]);
  }

  sabotage(tool: Tools): void {
    this.status[tool] = false;
  }

  repair(tools: Tools[]): void {
    tools.forEach((tool) => {
      this.status[tool] = true;
    });
  }
}

export class OtherPlayer extends AbstractPlayer {
  hand: number = 0;

  constructor({ hand, ...options }: AbstractPlayerOption & { hand: number }) {
    super(options);
    this.hand = hand;
  }
}

export class MyPlayer extends AbstractPlayer {
  hands: BaseCard.Playable[];

  constructor({
    hands,
    ...options
  }: AbstractPlayerOption & { hands: BaseCard.Playable[] }) {
    super(options);
    this.hands = hands;
  }

  get hand() {
    return this.hands.length;
  }
}
