export interface Grid2d<T> {
  get(x: number, y: number): T | null;
  set(x: number, y: number, value: T): void;
  has(x: number, y: number): boolean;
  delete(x: number, y: number): boolean;
  entries(): [[x: number, y: number], item: T][];
  clear(): void;
}

export class MapGrid2d<T> implements Grid2d<T> {
  private grid: Map<string, T>;

  constructor() {
    this.grid = new Map();
  }

  private toCoordinateKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  private fromCoordinateKey(key: string): [number, number] {
    const [x, y] = key.split(",").map(Number);
    return [x, y];
  }

  get(x: number, y: number): T | null {
    return this.grid.get(this.toCoordinateKey(x, y)) ?? null;
  }

  set(x: number, y: number, value: T): void {
    this.grid.set(this.toCoordinateKey(x, y), value);
  }

  has(x: number, y: number): boolean {
    return this.grid.has(this.toCoordinateKey(x, y));
  }

  delete(x: number, y: number): boolean {
    return this.grid.delete(this.toCoordinateKey(x, y));
  }

  entries(): [[number, number], T][] {
    return Array.from(this.grid.entries()).map(([key, value]) => [
      this.fromCoordinateKey(key),
      value,
    ]);
  }

  clear(): void {
    this.grid.clear();
  }
}
