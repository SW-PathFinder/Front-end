import { AbstractCard } from "@/libs/saboteur/cards";
import { Tools } from "@/libs/saboteur/types";

interface AbstractPlayerOption {
  name: string;
  status: Record<Tools, boolean>;
}

export abstract class AbstractPlayer {
  private static uid_counter = 1;
  readonly id: number = AbstractPlayer.uid_counter++;

  name: string;
  abstract readonly handCount: number;
  readonly status: Record<Tools, boolean>;

  constructor({
    name,
    status = { lantern: true, pickaxe: true, mineCart: false },
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
  handCount: number = 0;

  constructor({
    handCount,
    ...options
  }: AbstractPlayerOption & { handCount: number }) {
    super(options);
    this.handCount = handCount;
  }
}

export class MyPlayer extends AbstractPlayer {
  hands: AbstractCard.Playable[];
  gold: number;

  constructor({
    hands,
    gold = 0,
    ...options
  }: AbstractPlayerOption & { hands: AbstractCard.Playable[]; gold?: number }) {
    super(options);
    this.gold = gold;
    this.hands = hands;
  }

  get handCount() {
    return this.hands.length;
  }
}
