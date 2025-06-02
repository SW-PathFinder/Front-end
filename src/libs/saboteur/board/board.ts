import {
  CardAlreadyExistsError,
  CardIndestructibleError,
  CardNotInCoordinatesError,
  PathNotConnectedError,
  PathNotReachableError,
} from "@/libs/saboteur/board/error";
import { Grid2d, MapGrid2d } from "@/libs/saboteur/board/grid2d";
import { CardinalDirection, PathCard } from "@/libs/saboteur/cards";

export class GameBoard {
  private grid: Grid2d<PathCard.Abstract> = new MapGrid2d<PathCard.Abstract>();

  constructor() {
    this.startNewRound();
  }

  static readonly originCoordinates = [0, 0] satisfies readonly [
    number,
    number,
  ];
  static readonly destinationCoordinates = [
    [9, -2],
    [9, 0],
    [9, 2],
  ] satisfies readonly [number, number][];

  get cards(): readonly PathCard.Abstract[] {
    return this.grid.entries().map(([, card]) => card);
  }

  getCard(x: number, y: number): PathCard.Abstract | null {
    return this.grid.get(x, y);
  }

  canPlaceCard(
    x: number,
    y: number,
    card: PathCard.Abstract,
  ): [removed: true] | [removed: false, error: Error];
  canPlaceCard(
    x: number,
    y: number,
    card: PathCard.Abstract,
  ): [removed: boolean, error?: Error] {
    if (this.grid.has(x, y)) return [false, new CardAlreadyExistsError(x, y)];

    const disconnectedCards = this.getDisconnectedAdjacentCards(x, y, card);
    if (disconnectedCards.length > 0)
      return [false, new PathNotConnectedError(disconnectedCards)];

    if (!this.isReachable(x, y, card))
      return [false, new PathNotReachableError()];

    return [true];
  }

  placeCard(x: number, y: number, card: PathCard.Abstract): void {
    const [canPlace, error] = this.canPlaceCard(x, y, card);
    if (!canPlace) throw error;
    this._setCard(x, y, card);
  }

  canRemoveCard(
    x: number,
    y: number,
  ): [removed: true] | [removed: false, error: Error];
  canRemoveCard(x: number, y: number): [removed: boolean, error?: Error] {
    const existingCard = this.getCard(x, y);
    if (existingCard === null)
      return [false, new CardNotInCoordinatesError(x, y)];
    if (!existingCard.destructible)
      return [false, new CardIndestructibleError(existingCard)];

    return [true];
  }

  removeCard(x: number, y: number): void {
    const [canRemove, error] = this.canRemoveCard(x, y);
    if (!canRemove) throw error;

    this.grid.delete(x, y);
  }

  startNewRound(): void {
    this._clear();

    this._setCard(...GameBoard.originCoordinates, new PathCard.Origin());
    for (const destination of GameBoard.destinationCoordinates) {
      this._setCard(...destination, new PathCard.DestHidden());
    }
  }

  revealDestination(destId: 0 | 1 | 2, destCard: PathCard.AbstractDest): void {
    const coordinates = GameBoard.destinationCoordinates[destId];

    this._setCard(...coordinates, destCard);
  }

  import(
    cards: [[x: number, y: number], card: PathCard.Abstract][],
  ): GameBoard {
    this.startNewRound();

    for (const [[x, y], card] of cards) {
      if (card instanceof PathCard.AbstractDest) {
        this._setCard(x, y, card);
        continue;
      }

      const [canPlace, error] = this.canPlaceCard(x, y, card);
      if (!canPlace && !(error instanceof PathNotReachableError)) throw error;

      this._setCard(x, y, card);
    }

    return this;
  }

  export(): [[x: number, y: number], card: PathCard.Abstract][] {
    return this.grid.entries();
  }

  isReachable(x: number, y: number, card: PathCard.Abstract): boolean {
    // 시작점에서부터 해당 좌표까지 경로가 연결되어 있는지 확인
    const visited = new Set<string>();
    const stack: [number, number][] = [GameBoard.originCoordinates]; // 시작점에서 시작

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop()!;
      const key = `${currentX},${currentY}`;

      if (visited.has(key)) continue;
      visited.add(key);

      for (const direction of CardinalDirection.adjacentList) {
        const [nextX, nextY] = CardinalDirection.moveCoordinates(
          [currentX, currentY],
          direction,
        );

        if (
          nextX === x &&
          nextY === y &&
          card.isOpen(CardinalDirection.rotateHalf(direction))
        )
          return true;

        const adjacentCard = this.getCard(nextX, nextY);
        if (
          adjacentCard &&
          adjacentCard.canConnectWith(
            this.getCard(currentX, currentY)!,
            CardinalDirection.rotateHalf(direction),
          )
        ) {
          stack.push([nextX, nextY]);
        }
      }
    }

    return false;
  }

  private _clear(): void {
    this.grid.clear();
  }

  private _setCard(x: number, y: number, card: PathCard.Abstract): void {
    this.grid.set(x, y, card);
  }

  private getAdjacentCards(x: number, y: number) {
    const adjacentCards: {
      direction: CardinalDirection.Adjacent;
      coord: [number, number];
      card: PathCard.Abstract;
    }[] = [];

    for (const direction of CardinalDirection.adjacentList) {
      const newCoord = CardinalDirection.moveCoordinates([x, y], direction);
      const adjacentCard = this.grid.get(...newCoord);
      if (adjacentCard)
        adjacentCards.push({ direction, coord: newCoord, card: adjacentCard });
    }

    return adjacentCards;
  }

  private getDisconnectedAdjacentCards(
    x: number,
    y: number,
    card: PathCard.Abstract,
  ) {
    return this.getAdjacentCards(x, y).filter(
      ({ card: adjacentCard, direction }) =>
        !card.canConnectWith(adjacentCard, direction),
    );
  }
}
