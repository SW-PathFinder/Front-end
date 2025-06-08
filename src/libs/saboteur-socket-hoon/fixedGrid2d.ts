import { Grid2d } from "@/libs/saboteur/board";

// type Tuple<T, N extends number> = TupleImpl<T, N, []>;
// type TupleImpl<T, N extends number, R extends unknown[]> = R["length"] extends N
//   ? R
//   : TupleImpl<T, N, [...R, T]>;

const BOARD_GRID_SIZE = 23;

// [(13,12),(13,10),(13,8)]
// (0,0) -> (5,10)
// -10
export class FixedArrayGrid2d<T> implements Grid2d<T> {
  private static ROWS = BOARD_GRID_SIZE;
  private static COLS = BOARD_GRID_SIZE;

  private static firstCellRelativeCoord = { x: -5, y: -10 } as const;

  private grid: (T | null)[][];

  constructor() {
    this.grid = this.createEmptyGrid();
  }

  get(x: number, y: number): T | null {
    [x, y] = this.toAbsolute(x, y);
    return this.grid[y][x];
  }

  set(x: number, y: number, value: T): void {
    [x, y] = this.toAbsolute(x, y);

    this.grid[y][x] = value;
  }

  has(x: number, y: number): boolean {
    [x, y] = this.toAbsolute(x, y);

    return this.grid[y][x] !== null;
  }

  delete(x: number, y: number): boolean {
    if (!this.has(x, y)) return false;

    [x, y] = this.toAbsolute(x, y);
    this.grid[y][x] = null;
    return true;
  }

  entries(): [[number, number], T][] {
    const entries: [[number, number], T][] = [];
    for (let y = 0; y < FixedArrayGrid2d.ROWS; y++) {
      for (let x = 0; x < FixedArrayGrid2d.COLS; x++) {
        const value = this.get(x, y);
        if (value !== null) {
          entries.push([[x, y], value]);
        }
      }
    }
    return entries;
  }

  clear(): void {
    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid<T>() {
    return Array.from({ length: FixedArrayGrid2d.ROWS }, () =>
      Array(FixedArrayGrid2d.COLS).fill(null),
    ) as (T | null)[][];
  }

  private toAbsolute(relativeX: number, relativeY: number): [number, number] {
    const [x, y] = FixedArrayGrid2d.relativeToAbsolute(relativeX, relativeY);

    if (
      x < 0 ||
      x >= FixedArrayGrid2d.COLS ||
      y < 0 ||
      y >= FixedArrayGrid2d.ROWS
    ) {
      throw new Error(`Invalid coordinates: (${relativeX}, ${relativeY})`);
    }

    return [x, y];
  }

  /**
   * 상대 좌표계(-11 ~ 11)를 고정 좌표계(0 ~ 22)로 변환합니다.
   * (0,0) -> (10,5)
   */
  static relativeToAbsolute(x: number, y: number): [number, number] {
    // Transform coordinates to fit the grid

    return [
      x - FixedArrayGrid2d.firstCellRelativeCoord.x,
      y - FixedArrayGrid2d.firstCellRelativeCoord.y,
    ];
  }

  /**
   * 고정 좌표계(0 ~ 22)를 상대 좌표계 (-11 ~ 11)로 변환합니다.
   */
  static absoluteToRelative(x: number, y: number): [number, number] {
    // Transform coordinates to fit the grid
    return [
      x + FixedArrayGrid2d.firstCellRelativeCoord.x,
      y + FixedArrayGrid2d.firstCellRelativeCoord.y,
    ];
  }
}
