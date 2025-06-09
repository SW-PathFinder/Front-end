import { CardinalDirection, SaboteurCard } from "../cards";

export class GameBoardError extends Error {}
export class CardPlacementError extends GameBoardError {
  constructor(message: string) {
    super(`카드 배치 오류: ${message}`);
  }
}
export class CardAlreadyExistsError extends CardPlacementError {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(`해당 위치에 이미 카드가 있습니다.`);
    this.x = x;
    this.y = y;
  }
}
export class PathNotConnectedError extends CardPlacementError {
  disconnectedCards: {
    direction: CardinalDirection.Adjacent;
    coord: [number, number];
    card: SaboteurCard.Path.Abstract;
  }[];
  constructor(
    disconnectedCards: {
      direction: CardinalDirection.Adjacent;
      coord: [number, number];
      card: SaboteurCard.Path.Abstract;
    }[],
  ) {
    super(
      `카드가 ${disconnectedCards
        .map((disconnected) =>
          CardinalDirection.toString(disconnected.direction),
        )
        .filter((t) => !!t)
        .join(",")}으로 인접한 카드와 경로가 연결되어 있지 않습니다.`,
    );

    this.disconnectedCards = disconnectedCards;
  }
}
export class PathNotReachableError extends CardPlacementError {
  constructor() {
    super(`경로가 출발지와 연결되지 않았습니다`);
  }
}

export class CardDestructionError extends GameBoardError {
  constructor(message: string) {
    super(`카드 파괴 오류: ${message}`);
  }
}

export class CardNotInCoordinatesError extends CardDestructionError {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(`해당 위치에 카드가 없습니다.`);
    this.x = x;
    this.y = y;
  }
}

export class CardIndestructibleError extends CardDestructionError {
  constructor(card: SaboteurCard.Path.Abstract) {
    super(`카드 ${card.type}는 파괴할 수 없습니다.`);
  }
}
