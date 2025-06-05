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

  export type Defined = Adjacent | typeof All | typeof None;

  export type Any = Defined | (number & { _any?: true });

  export function rotateHalf(direction: Adjacent): Adjacent;
  export function rotateHalf(direction: Any): Any;
  export function rotateHalf(direction: Any) {
    return ((direction << 2) & 0b1100) | ((direction >> 2) & 0b0011);
  }

  export function includes(subset: Any, direction: Any): boolean {
    return (direction & subset) === subset;
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

  export function toString(direction: Defined): string {
    switch (direction) {
      case East:
        return "동쪽";
      case South:
        return "남쪽";
      case West:
        return "서쪽";
      case North:
        return "북쪽";
      case All:
        return "모든 방향";
      case None:
        return "연결되지 않음";
      default:
        return `방향(${direction})`;
    }
  }
}
export type CardinalDirection = CardinalDirection.Any;
