import { GameSessionPlayer } from "@/libs/gameSession";

import { SaboteurCard } from "./cards";
import { PlayerRole, Tools } from "./types";

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

  isMe(): this is MySaboteurPlayer {
    return this instanceof MySaboteurPlayer;
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

  sync(data: { status?: Partial<Record<Tools, boolean>> }): void {
    if (data.status !== undefined)
      this._status = { ...this._status, ...data.status };
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

  sync(data: {
    status?: Partial<Record<Tools, boolean>>;
    handCount?: number;
  }): void {
    super.sync(data);
    if (data.handCount !== undefined) this.handCount = data.handCount;
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
  private _hands: SaboteurCard.Abstract.Playable[];

  constructor({
    role,
    hands = [],
    gold = 0,
    ...options
  }: AbstractPlayerOption & {
    role?: PlayerRole;
    hands?: SaboteurCard.Abstract.Playable[];
    gold?: number;
  }) {
    super(options);
    this.gold = gold;
    this.role = role ?? null;
    this._hands = hands;
  }

  get hands(): ReadonlyArray<SaboteurCard.Abstract.Playable> {
    return this._hands;
  }

  get handCount() {
    return this._hands.length;
  }

  append(card: SaboteurCard.Abstract.Playable): this {
    this._hands.push(card);

    return this;
  }

  /**
   * @return removed card
   */
  removeByCardUid(cardUid: string): SaboteurCard.Abstract.Playable | null {
    const cardIndex = this._hands.findIndex((card) => card.uid === cardUid);
    if (cardIndex === -1) return null; // Card not found

    return this.removeByIndex(cardIndex);
  }

  /**
   * @return removed card
   */
  removeByIndex(cardIndex: number): SaboteurCard.Abstract.Playable {
    if (cardIndex < 0 || cardIndex >= this._hands.length) {
      throw new Error("Invalid card index");
    }
    return this._hands.splice(cardIndex, 1)[0];
  }

  insert(cardIndex: number, card: SaboteurCard.Abstract.Playable): this {
    if (cardIndex < 0 || cardIndex > this._hands.length) {
      throw new Error("Invalid card index");
    }
    this._hands.splice(cardIndex, 0, card);

    return this;
  }

  resetRoundState(): void {
    super.resetRoundState();
    this.role = null;
    this._hands = [];
  }

  sync(data: {
    status?: Partial<Record<Tools, boolean>>;
    gold?: number;
    role?: PlayerRole | null;
    hands?: SaboteurCard.Abstract.Playable[];
  }): void {
    super.sync(data);

    if (data.gold !== undefined) this.gold = data.gold;
    if (data.role !== undefined) this.role = data.role;
    if (data.hands !== undefined) this._hands = data.hands;
  }
}
