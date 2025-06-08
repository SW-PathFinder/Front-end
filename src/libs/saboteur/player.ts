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
  protected _status: Record<Tools, boolean>;

  constructor({
    id,
    status = { lantern: true, pickaxe: true, mineCart: true },
  }: AbstractPlayerOption) {
    this.id = id;
    this._status = status;
  }

  get name(): string {
    return this.id;
  }

  get status(): Readonly<Record<Tools, boolean>> {
    return { ...this._status };
  }

  someToolIsAvailable(tools: Tools[]): boolean {
    return tools.some((tool) => this._status[tool]);
  }

  sabotage(tool: Tools): void {
    this._status[tool] = false;
  }

  repair(tool: Tools): void {
    this._status[tool] = true;
  }

  resetRoundState(): void {
    this._status = { lantern: true, pickaxe: true, mineCart: true };
  }
}

export class OtherSaboteurPlayer extends AbstractSaboteurPlayer {
  handCount: number;

  constructor({
    handCount = 0,
    ...options
  }: AbstractPlayerOption & { handCount?: number }) {
    super(options);
    this.handCount = handCount;
  }

  resetRoundState(): void {
    super.resetRoundState();
    this.handCount = 0;
  }

  static readonly handCountPerPlayersMap: Record<number, number> = {
    3: 6,
    4: 6,
    5: 6,
    6: 5,
    7: 5,
    8: 4,
    9: 4,
    10: 4,
  };

  static getInitialHandCount(playerCount: number): number {
    return this.handCountPerPlayersMap[playerCount] ?? 4;
  }
}

export class MySaboteurPlayer extends AbstractSaboteurPlayer {
  gold: number;

  role: PlayerRole | null;
  private _hands: AbstractCard.Playable[];

  constructor({
    role,
    hands = [],
    gold = 0,
    ...options
  }: AbstractPlayerOption & {
    role?: PlayerRole;
    hands?: AbstractCard.Playable[];
    gold?: number;
  }) {
    super(options);
    this.gold = gold;
    this.role = role ?? null;
    this._hands = hands;
  }

  get hands(): ReadonlyArray<AbstractCard.Playable> {
    return this._hands;
  }

  get handCount() {
    return this._hands.length;
  }

  add(card: AbstractCard.Playable): this {
    this._hands.push(card);

    return this;
  }

  use(cardIndex: number): AbstractCard.Playable {
    if (cardIndex < 0 || cardIndex >= this._hands.length) {
      throw new Error("Invalid card index");
    }
    return this._hands.splice(cardIndex, 1)[0];
  }

  resetRoundState(): void {
    super.resetRoundState();
    this._hands = [];
    this.role = null;
  }
}
