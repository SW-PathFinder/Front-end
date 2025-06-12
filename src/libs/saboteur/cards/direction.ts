export namespace CardinalDirection {
  export const East = 0b0001;
  export const South = 0b0010;
  export const West = 0b0100;
  export const North = 0b1000;

  export const adjacentList = [East, South, West, North] as const;
  export type Adjacent =
    | typeof East
    | typeof South
    | typeof West
    | typeof North;

  export const None = 0b0000;
  export const All = 0b1111;
  export const Some = Symbol("CardinalDirection.Some");
  export type Some = typeof Some;

  export type Defined = Adjacent | typeof All | typeof None;

  export type Any = Defined | (number & { _any?: true });

  export function rotateHalf(direction: Adjacent): Adjacent;
  export function rotateHalf(direction: Any): Any;
  export function rotateHalf(direction: Any) {
    return ((direction << 2) & 0b1100) | ((direction >> 2) & 0b0011);
  }

  export function add(direction: Any, subset: Adjacent | Some): Any | Some {
    if (subset === Some) return Some;
    return (direction | subset) as Adjacent;
  }
  export function remove(direction: Any, subset: Adjacent | Some): Any {
    if (subset === Some) return None;
    return direction & ~subset;
  }

  export function includes(subset: Any, direction: Any | Some): boolean {
    if (direction === Some) return subset !== None;
    return (subset & direction) === direction;
  }

  export function toCoordinateDiff(direction: Adjacent): [number, number] {
    switch (direction) {
      case East:
        return [1, 0];
      case South:
        return [0, 1];
      case West:
        return [-1, 0];
      case North:
        return [0, -1];
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  }

  export function moveTo(
    coordinates: [number, number],
    delta: [number, number],
  ): [number, number];
  export function moveTo(
    coordinates: [number, number],
    direction: Adjacent,
  ): [number, number];
  export function moveTo(
    coordinates: [number, number],
    directionOrDelta: Adjacent | [number, number],
  ): [number, number] {
    const [x, y] = coordinates;
    let dx: number, dy: number;
    if (Array.isArray(directionOrDelta)) {
      [dx, dy] = directionOrDelta;
    } else {
      [dx, dy] = toCoordinateDiff(directionOrDelta);
    }

    return [x + dx, y + dy];
  }

  export function extractDirections(
    directions: Any,
  ): CardinalDirection.Adjacent[] {
    return CardinalDirection.adjacentList.filter(
      (adjacent) => directions & adjacent,
    );
  }

  export function toString(direction: Any | Some): string {
    if (direction === Some) return "임의의 방향";
    if (direction === None) return "연결되지 않음";
    if (direction === All) return "모든 방향";
    let text = "";
    for (const extracted of extractDirections(direction)) {
      switch (extracted) {
        case East:
          text += "동쪽";
          break;
        case South:
          text += "남쪽";
          break;
        case West:
          text += "서쪽";
          break;
        case North:
          text += "북쪽";
          break;
      }
    }
    return text || "연결되지 않음";
  }
}
export type CardinalDirection = CardinalDirection.Any;
