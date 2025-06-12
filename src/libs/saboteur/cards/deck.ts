import { Tools } from "../types";
import { SaboteurCard } from "./index";

export class SaboteurCardPool {
  private readonly _cards: SaboteurCard.Abstract.Playable[] =
    SaboteurCardPool.init();
  // private unknownUsedCardCount: number = 0;
  // private _usedCards: SaboteurCard.Abstract.Playable[] = [];
  private _remainingCount: number = this._cards.length;

  constructor() {
    this.resetGameState();
  }

  getRemainingCount(): number {
    return this._remainingCount;
  }

  resetGameState(): void {
    // this._cards = SaboteurCardPool.init();
    this.resetRoundState();
  }

  resetRoundState(): void {
    // this.shuffle();
    // this._usedCards = [];
    // this.unknownUsedCardCount = 0;
    this._remainingCount = this._cards.length;
  }

  decreaseRemainingCard(num: number): void {
    this._remainingCount -= num;
  }

  // shuffle(): void {
  //   for (let i = this.cards.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
  //   }
  // }

  // findByUid(card: SaboteurCard.Abstract.Playable): number {
  //   return this.cards.findIndex((c) => c.uid === card.uid);
  // }

  // findByKind(card: SaboteurCard.Abstract.Playable): number {
  //   return this._cards.findIndex((c) => c.isSame(card));
  // }

  // protected removeByIndex(
  //   index: number,
  // ): SaboteurCard.Abstract.Playable | undefined {
  //   if (index < 0 || index >= this.cards.length) return undefined;

  //   const card = this.cards[index];
  //   this._usedCards.push(card);

  //   return card;
  // }

  // removeByUid(
  //   card: SaboteurCard.Abstract.Playable,
  // ): SaboteurCard.Abstract.Playable | undefined {
  //   const index = this.findByUid(card);
  //   return this.removeByIndex(index);
  // }

  // removeByKind(
  //   card: SaboteurCard.Abstract.Playable,
  // ): SaboteurCard.Abstract.Playable | undefined {
  //   const index = this.findByKind(card);
  //   return this.removeByIndex(index);
  // }

  // drawOnTop(): SaboteurCard.Abstract.Playable | undefined {
  //   const card = this.cards.at(-1);
  //   if (card) this._usedCards.push(card);
  //   return card;
  // }

  sync(
    deckCount: number,
    // cardsUsed: SaboteurCard.Abstract.Playable[],
    // players: AbstractSaboteurPlayer[],
  ) {
    this.resetRoundState();
    this._remainingCount = deckCount;
    // this._usedCards.push(...cardsUsed);

    // for (const player of players) {
    //   if (player.isMe()) {
    //     this._usedCards.push(...player.hands);
    //   } else {
    //     this.unknownUsedCardCount += player.handCount;
    //   }
    // }
  }

  protected static init(): SaboteurCard.Abstract.Playable[] {
    return [
      new SaboteurCard.Path.Way4(),
      new SaboteurCard.Path.Way4(),
      new SaboteurCard.Path.Way4(),
      new SaboteurCard.Path.Way4(),
      new SaboteurCard.Path.Way4(),
      new SaboteurCard.Path.Block4(),
      new SaboteurCard.Path.Way3A(),
      new SaboteurCard.Path.Way3A(),
      new SaboteurCard.Path.Way3A(),
      new SaboteurCard.Path.Way3A(),
      new SaboteurCard.Path.Way3A(),
      new SaboteurCard.Path.Block3A(),
      new SaboteurCard.Path.Way3B(),
      new SaboteurCard.Path.Way3B(),
      new SaboteurCard.Path.Way3B(),
      new SaboteurCard.Path.Way3B(),
      new SaboteurCard.Path.Way3B(),
      new SaboteurCard.Path.Block3B(),
      new SaboteurCard.Path.Way2A(),
      new SaboteurCard.Path.Way2A(),
      new SaboteurCard.Path.Way2A(),
      new SaboteurCard.Path.Way2A(),
      new SaboteurCard.Path.Block2A(),
      new SaboteurCard.Path.Way2B(),
      new SaboteurCard.Path.Way2B(),
      new SaboteurCard.Path.Way2B(),
      new SaboteurCard.Path.Way2B(),
      new SaboteurCard.Path.Way2B(),
      new SaboteurCard.Path.Block2B(),
      new SaboteurCard.Path.Way2C(),
      new SaboteurCard.Path.Way2C(),
      new SaboteurCard.Path.Way2C(),
      new SaboteurCard.Path.Block2C(),
      new SaboteurCard.Path.Way2D(),
      new SaboteurCard.Path.Way2D(),
      new SaboteurCard.Path.Way2D(),
      new SaboteurCard.Path.Way2D(),
      new SaboteurCard.Path.Block2D(),
      new SaboteurCard.Path.Block1A(),
      new SaboteurCard.Path.Block1B(),

      new SaboteurCard.Action.Sabotage(Tools.Lantern),
      new SaboteurCard.Action.Sabotage(Tools.Lantern),
      new SaboteurCard.Action.Sabotage(Tools.Lantern),
      new SaboteurCard.Action.Sabotage(Tools.Pickaxe),
      new SaboteurCard.Action.Sabotage(Tools.Pickaxe),
      new SaboteurCard.Action.Sabotage(Tools.Pickaxe),
      new SaboteurCard.Action.Sabotage(Tools.MineCart),
      new SaboteurCard.Action.Sabotage(Tools.MineCart),
      new SaboteurCard.Action.Sabotage(Tools.MineCart),

      new SaboteurCard.Action.Repair([Tools.Lantern]),
      new SaboteurCard.Action.Repair([Tools.Lantern]),
      new SaboteurCard.Action.Repair([Tools.Pickaxe]),
      new SaboteurCard.Action.Repair([Tools.Pickaxe]),
      new SaboteurCard.Action.Repair([Tools.MineCart]),
      new SaboteurCard.Action.Repair([Tools.MineCart]),
      new SaboteurCard.Action.Repair([Tools.Lantern, Tools.Pickaxe]),
      new SaboteurCard.Action.Repair([Tools.Lantern, Tools.MineCart]),
      new SaboteurCard.Action.Repair([Tools.Pickaxe, Tools.MineCart]),

      new SaboteurCard.Action.Map(),
      new SaboteurCard.Action.Map(),
      new SaboteurCard.Action.Map(),
      new SaboteurCard.Action.Map(),
      new SaboteurCard.Action.Map(),
      new SaboteurCard.Action.Map(),

      new SaboteurCard.Action.Destroy(),
      new SaboteurCard.Action.Destroy(),
      new SaboteurCard.Action.Destroy(),
    ];
  }
}
