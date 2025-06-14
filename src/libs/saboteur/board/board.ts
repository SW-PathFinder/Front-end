import { CardinalDirection, SaboteurCard } from "../cards";
import {
  CardAlreadyExistsError,
  CardIndestructibleError,
  CardNotInCoordinatesError,
  PathNotConnectedError,
  PathNotReachableError,
} from "./error";
import { Grid2d, MapGrid2d } from "./grid2d";

export class GameBoard {
  private grid: Grid2d<SaboteurCard.Path.Abstract> =
    new MapGrid2d<SaboteurCard.Path.Abstract>();

  constructor() {
    this.resetGameState();
  }

  static readonly originCoordinates = [0, 0] satisfies readonly [
    number,
    number,
  ];
  static readonly destinationCoordinates = [
    [8, -2],
    [8, 0],
    [8, 2],
  ] satisfies readonly [number, number][];

  get cards(): readonly SaboteurCard.Path.Abstract[] {
    return this.grid.entries().map(([, card]) => card);
  }

  getCard(x: number, y: number): SaboteurCard.Path.Abstract | null {
    return this.grid.get(x, y);
  }

  canPlaceCard(
    x: number,
    y: number,
    card: SaboteurCard.Path.Abstract,
  ): [removed: true] | [removed: false, error: Error];
  canPlaceCard(
    x: number,
    y: number,
    card: SaboteurCard.Path.Abstract,
  ): [removed: boolean, error?: Error] {
    if (this.grid.has(x, y)) return [false, new CardAlreadyExistsError(x, y)];

    const disconnectedCards = this.getDisconnectedAdjacentCards(x, y, card);
    if (disconnectedCards.length > 0)
      return [false, new PathNotConnectedError(disconnectedCards)];

    if (!this.isReachable(x, y, card))
      return [false, new PathNotReachableError()];

    return [true];
  }

  placeCard(x: number, y: number, card: SaboteurCard.Path.Abstract): void {
    const [canPlace] = this.canPlaceCard(x, y, card);
    // if (!canPlace) throw error;
    console.log(
      `XXX Placing card at (${x}, ${y}): ${canPlace ? "Success" : "Failed"} ${card.image}, ${card.flipped} , card
      error,`,
    );
    this._setCard(x, y, card);
  }

  canRemoveCard(
    x: number,
    y: number,
  ): [removed: true] | [removed: false, error: Error];
  canRemoveCard(x: number, y: number): [removed: boolean, error?: Error] {
    const existingCard = this.getCard(x, y);
    console.log(
      `XXX Checking if can remove card at (${x}, ${y}): ${existingCard}`,
      existingCard,
    );
    if (existingCard === null)
      return [false, new CardNotInCoordinatesError(x, y)];
    if (!existingCard.destructible)
      return [false, new CardIndestructibleError(existingCard)];

    return [true];
  }

  removeCard(x: number, y: number): void {
    const [canRemove, error] = this.canRemoveCard(x, y);
    // if (!canRemove) throw error;
    console.log(
      `XXX Removing card at (${x}, ${y}): ${canRemove ? "Success" : "Failed"}`,
      error,
    );

    this.grid.delete(x, y);
  }

  resetGameState(): void {
    this.resetRoundState();
  }

  resetRoundState(): void {
    this._clear();

    this._setCard(
      ...GameBoard.originCoordinates,
      new SaboteurCard.Path.Origin(),
    );
    for (const destination of GameBoard.destinationCoordinates) {
      this._setCard(...destination, new SaboteurCard.Path.DestHidden());
    }
  }

  revealDestination(
    x: number,
    y: number,
    destCard: SaboteurCard.Path.AbstractDest,
  ): void {
    if (
      !GameBoard.destinationCoordinates.find(
        ([destX, destY]) => destX === x && destY === y,
      )
    )
      throw new CardNotInCoordinatesError(x, y);

    this._setCard(x, y, destCard);
  }

  import(
    cards: [[x: number, y: number], card: SaboteurCard.Path.Abstract][],
    checkConditions = true,
  ): GameBoard {
    this.resetRoundState();

    for (const [[x, y], card] of cards) {
      if (card instanceof SaboteurCard.Path.AbstractDest) {
        this._setCard(x, y, card);
        continue;
      }

      const [canPlace, error] = this.canPlaceCard(x, y, card);
      if (
        checkConditions &&
        !canPlace &&
        !(error instanceof PathNotReachableError)
      )
        throw error;

      this._setCard(x, y, card);
    }

    return this;
  }

  export(): [[x: number, y: number], card: SaboteurCard.Path.Abstract][] {
    return this.grid.entries();
  }

  getPossiblePositions(
    card: SaboteurCard.Path.Abstract,
  ): [x: number, y: number][] {
    const positions: [number, number][] = [];

    const checked = new Set<string>([
      `${GameBoard.originCoordinates[0]},${GameBoard.originCoordinates[1]}`,
    ]);
    const stack: (readonly [
      x: number,
      y: number,
      connectedFrom: CardinalDirection.Adjacent,
    ])[] = [];

    for (const direction of CardinalDirection.adjacentList) {
      const [nextX, nextY] = CardinalDirection.moveTo(
        GameBoard.originCoordinates,
        direction,
      );
      stack.push([nextX, nextY, CardinalDirection.rotateHalf(direction)]);
    }

    while (stack.length > 0) {
      const [currentX, currentY, connectedFrom] = stack.pop()!;
      const key = `${currentX},${currentY}`;

      if (checked.has(key)) continue;
      checked.add(key);

      const currentCard = this.getCard(currentX, currentY);
      if (currentCard) {
        // 시작점과 연결되어있는지 확인
        if (!currentCard.isOpen(connectedFrom)) {
          continue;
        }

        for (const direction of CardinalDirection.adjacentList) {
          if (direction === connectedFrom) continue;

          const [nextX, nextY] = CardinalDirection.moveTo(
            [currentX, currentY],
            direction,
          );
          if (currentCard.isConnected(connectedFrom, direction)) {
            stack.push([nextX, nextY, CardinalDirection.rotateHalf(direction)]);
          }
        }
      } else {
        // 현재 위치에 카드를 놓을 수 있는지 확인
        const adjacentCards = this.getAdjacentCards(currentX, currentY);
        if (
          adjacentCards.every(({ card: adjacentCard, direction }) =>
            card.canConnectWith(adjacentCard, direction),
          )
        ) {
          positions.push([currentX, currentY]);
        }
      }
    }

    return positions;
  }

  isReachable(x: number, y: number, card: SaboteurCard.Path.Abstract): boolean {
    const possiblePositions = this.getPossiblePositions(card);
    // 해당 좌표가 가능한 위치 중 하나인지 확인
    return possiblePositions.some(([posX, posY]) => posX === x && posY === y);
  }

  sync(
    sparseRepresentation: {
      x: number;
      y: number;
      card: SaboteurCard.Path.Abstract;
    }[],
  ) {
    this._clear();

    for (const { x, y, card } of sparseRepresentation) {
      // if (card instanceof SaboteurCard.Path.AbstractDest) {
      //   this._setCard(x, y, card);
      //   continue;
      // }

      // const [canPlace, error] = this.canPlaceCard(x, y, card);
      // if (!canPlace && !(error instanceof PathNotReachableError)) throw error;

      this._setCard(x, y, card);
    }
  }

  private _clear(): void {
    this.grid.clear();
  }

  private _setCard(
    x: number,
    y: number,
    card: SaboteurCard.Path.Abstract,
  ): void {
    this.grid.set(x, y, card);
  }

  private getAdjacentCards(x: number, y: number) {
    const adjacentCards: {
      direction: CardinalDirection.Adjacent;
      coord: [number, number];
      card: SaboteurCard.Path.Abstract;
    }[] = [];

    for (const direction of CardinalDirection.adjacentList) {
      const newCoord = CardinalDirection.moveTo([x, y], direction);
      const adjacentCard = this.grid.get(...newCoord);
      if (adjacentCard)
        adjacentCards.push({ direction, coord: newCoord, card: adjacentCard });
    }

    return adjacentCards;
  }

  private getDisconnectedAdjacentCards(
    x: number,
    y: number,
    card: SaboteurCard.Path.Abstract,
  ) {
    return this.getAdjacentCards(x, y).filter(
      ({ card: adjacentCard, direction }) =>
        !card.canConnectWith(adjacentCard, direction),
    );
  }
}
