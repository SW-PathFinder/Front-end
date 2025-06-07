import { describe, expect, test } from "vitest";

import {
  CardAlreadyExistsError,
  CardPlacementError,
  GameBoard,
  PathNotConnectedError,
} from "@/libs/saboteur/board";
import { SaboteurCard } from "@/libs/saboteur/cards";

describe("초기화", () => {
  test("새로 생성된 보드는 출발지, 숨겨진 도착지가 설정되어 있어야 한다", () => {
    const board = new GameBoard();

    expect(board.export().length).toBe(4);
    expect(board.getCard(...GameBoard.originCoordinates)).toBeInstanceOf(
      SaboteurCard.Path.Origin,
    );
    for (const destination of GameBoard.destinationCoordinates) {
      expect(board.getCard(...destination)).toBeInstanceOf(
        SaboteurCard.Path.DestHidden,
      );
    }
  });

  test("보드는 startNewRound 함수를 통해 보드 상태를 라운드 시작시의 상태로 설정할 수 있다", () => {
    const board = new GameBoard();
    board.placeCard(1, 0, new SaboteurCard.Path.Way4());
    board.placeCard(0, 1, new SaboteurCard.Path.Way4());

    board.startNewRound();

    expect(board.export().length).toBe(4);
    expect(board.getCard(...GameBoard.originCoordinates)).toBeInstanceOf(
      SaboteurCard.Path.Origin,
    );
    for (const destination of GameBoard.destinationCoordinates) {
      expect(board.getCard(...destination)).toBeInstanceOf(
        SaboteurCard.Path.DestHidden,
      );
    }
  });
});

describe("카드 가져오기", () => {
  test("좌표에 카드가 존재하지 않으면 null을 반환한다", () => {
    const board = new GameBoard();
    expect(board.getCard(1, 1)).toBeNull();
  });

  test("좌표에 카드가 존재하면 해당 카드를 반환한다", () => {
    const board = new GameBoard();
    const card = new SaboteurCard.Path.Way4();
    board.placeCard(1, 0, card);
    expect(board.getCard(1, 0)).toBe(card);
  });

  test("보드에 있는 모든 카드들을 좌표와 함께 가져올 수 있다", () => {
    const board = new GameBoard();

    const card1 = new SaboteurCard.Path.Way4();
    const card2 = new SaboteurCard.Path.Block4();
    board.placeCard(1, 0, card1);
    board.placeCard(2, 0, card2);

    const cards = board.export();
    expect(cards).toContainEqual([[1, 0], card1]);
    expect(cards).toContainEqual([[2, 0], card2]);
    expect(cards.length).toBe(6); // 출발지와 숨겨진 도착지 포함
  });
});

describe("상태 불러오기", () => {
  test("정상적인 보드 상태를 불러올 수 있다", () => {
    const board = new GameBoard();
    board.import([[[1, 0], new SaboteurCard.Path.Block4()]]);
    expect(board.getCard(1, 0)).toBeInstanceOf(SaboteurCard.Path.Block4);

    // 도착지 카드를 알맞은 카드로 덮어쓸 수 있음
    const dest1Coord = GameBoard.destinationCoordinates[0];
    board.import([[dest1Coord, new SaboteurCard.Path.DestRockA()]]);
    expect(board.getCard(...dest1Coord)).toBeInstanceOf(
      SaboteurCard.Path.DestRockA,
    );

    // 낙석 카드로 인해 고립된 카드가 생길 수 있음
    board.import([[[2, 0], new SaboteurCard.Path.Block4()]]);
    expect(board.getCard(2, 0)).toBeInstanceOf(SaboteurCard.Path.Block4);
  });

  describe("정상적이지 않은 보드 상태는 불러올 수 없다", () => {
    const board = new GameBoard();
    test("위치가 중복되는 카드가 있는 상태", () => {
      expect(() =>
        board.import([
          [[1, 0], new SaboteurCard.Path.Block4()],
          [[1, 0], new SaboteurCard.Path.Way4()],
        ]),
      ).toThrowError();
    });

    test("특별한 카드 위치를 덮어쓰는 잘못된 카드가 있는 상태", () => {
      expect(() =>
        board.import([[[0, 0], new SaboteurCard.Path.Block4()]]),
      ).toThrowError();
    });

    test("연결될 수 없는 카드가 연결되어있는 형태", () => {
      expect(() =>
        board.import([[[1, 0], new SaboteurCard.Path.Way2A()]]),
      ).toThrowError();
    });
  });
});

/**
 * canPlaceCard로 카드를 놓기 전 검사가 가능하고, placeCard는 잘못된 경우 예외를 던진다.
 */
describe("카드 놓기", () => {
  test("이미 카드가 존재하는 위치에는 카드를 놓을 수 없다", () => {
    const board = new GameBoard();
    const card = new SaboteurCard.Path.Block4();

    board.placeCard(1, 0, card);
    expect(board.getCard(1, 0)).toBe(card);

    // 이미 카드가 있는 위치에 카드를 놓으려 하면 예외가 발생한다.
    expect(board.canPlaceCard(1, 0, card)[0]).toEqual(false);
    expect(() => board.placeCard(1, 0, card)).toThrowError(
      CardAlreadyExistsError,
    );
  });

  test("시작점에서 길이 이어진 위치에만 카드를 놓을 수 있다", () => {
    const board = new GameBoard();
    board.import([]);

    const card = new SaboteurCard.Path.Way2A(true);

    // 시작점에 인접한 위치에 카드를 놓을 수 있다.
    expect(board.canPlaceCard(1, 0, card)).toEqual([true]);
    board.placeCard(1, 0, card);
    expect(board.getCard(1, 0)).toBe(card);

    // 시작점에서 이어지지 않은 위치에는 카드를 놓을 수 없다.
    expect(board.canPlaceCard(2, 2, card)[0]).toEqual(false);
    expect(() => board.placeCard(2, 2, card)).toThrowError(CardPlacementError);
  });

  test("인접한 모든 카드와 길이 연결되어있어야 카드를 놓을 수 있다", () => {
    const board = new GameBoard();
    board.import([]);

    const card = new SaboteurCard.Path.Way2A(true);

    // 시작점에 인접하게 카드를 놓을 수 있다.
    expect(board.canPlaceCard(1, 0, card)).toEqual([true]);
    board.placeCard(1, 0, card);
    expect(board.getCard(1, 0)).toBe(card);

    // 인접한 카드와 연결되어 있지 않으면 카드를 놓을 수 없다.
    expect(board.canPlaceCard(2, 0, card)[0]).toEqual(false);
    expect(() => board.placeCard(2, 0, card)).toThrowError(
      PathNotConnectedError,
    );

    // 인접한 카드와 연결되어 있으면 카드를 놓을 수 있다.

    const card2 = new SaboteurCard.Path.Way2A();
    expect(board.canPlaceCard(1, -1, card2)).toEqual([true]);
    board.placeCard(1, -1, card2);
    expect(board.getCard(1, -1)).toBe(card2);
  });
});

describe("카드 제거", () => {
  test("제거 가능한 카드는 제거할 수 있다", () => {
    const board = new GameBoard();
    const card = new SaboteurCard.Path.Block4();

    board.placeCard(1, 0, card);
    expect(board.canRemoveCard(1, 0)).toEqual([true]);

    board.removeCard(1, 0);
    expect(board.getCard(1, 0)).toBeNull();
  });
  test("출발지, 도착지 등의 특별한 카드는 제거할 수 없다", () => {
    const board = new GameBoard();
    expect(board.canRemoveCard(...GameBoard.originCoordinates)[0]).toEqual(
      false,
    );

    for (const destination of GameBoard.destinationCoordinates) {
      expect(board.canRemoveCard(...destination)[0]).toEqual(false);
    }
  });
});
