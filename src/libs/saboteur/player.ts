import { GameSessionPlayer } from "@/libs/gameSession";
import { AbstractCard } from "@/libs/saboteur/cards";
import { PlayerRole, Tools } from "@/libs/saboteur/types";

interface AbstractPlayerOption {
  id: string;
  status?: Record<Tools, boolean>;
}

export abstract class AbstractSaboteurPlayer implements GameSessionPlayer {
  readonly uid: number = AbstractSaboteurPlayer.uid_counter++;
  private static uid_counter = 1;

  readonly id: string;
  abstract readonly handCount: number;
  readonly status: Record<Tools, boolean>;

  constructor({
    id,
    status = { lantern: true, pickaxe: true, mineCart: false },
  }: AbstractPlayerOption) {
    this.id = id;
    this.status = status;
  }

  get name(): string {
    return this.id;
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

export class OtherSaboteurPlayer extends AbstractSaboteurPlayer {
  handCount: number;

  constructor({
    handCount,
    ...options
  }: AbstractPlayerOption & { handCount: number }) {
    super(options);
    this.handCount = handCount;
  }
}

export class MySaboteurPlayer extends AbstractSaboteurPlayer {
  role: PlayerRole;
  hands: AbstractCard.Playable[];
  gold: number;

  constructor({
    role,
    hands,
    gold = 0,
    ...options
  }: AbstractPlayerOption & {
    role: PlayerRole;
    hands: AbstractCard.Playable[];
    gold?: number;
  }) {
    super(options);
    this.role = role;
    this.hands = hands;
    this.gold = gold;
  }

  get handCount() {
    return this.hands.length;
  }
}
