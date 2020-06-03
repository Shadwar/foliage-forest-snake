export enum CellType {
  EMPTY,
  SNAKE,
  FOOD
}

export enum Status {
  START,
  WAIT,
  RUN,
  END
}

export enum Direction {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export type SnakePart = [number, number];
