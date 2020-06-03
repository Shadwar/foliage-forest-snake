import {SnakePart, CellType, Direction} from './types';

/** Игровой тик, зависит от текущего счета */
export function tick(score: number) {
  return new Promise((resolve) => setTimeout(resolve, 1000 / (1 + score)));
}

/** Заполнение ячеек по их типу */
export function populateCells([snake, food]: [SnakePart[], SnakePart | null]): CellType[] {
  const result = Array.from({ length: 15 * 15 }, () => CellType.EMPTY);

  for (let part of snake) {
    result[part[1] * 15 + part[0]] = CellType.SNAKE;
  }

  if (food) {
    result[food[1] * 15 + food[0]] = CellType.FOOD;
  }

  return result;
}

/** Создание еды в свободном месте */
export function createFood(snake: SnakePart[], food: SnakePart | null): SnakePart {
  if (food) {
    return food;
  }

  while (true) {
    const x = Math.floor(Math.random() * 15);
    const y = Math.floor(Math.random() * 15);

    if (!snake.some(part => part[0] === x && part[1] === y)) {
      return [x, y];
    }
  }
}

/** Движение змеи */
export function moveSnake([snake, food, direction]: [
  SnakePart[],
  SnakePart | null,
  Direction
]): [SnakePart[], SnakePart | null] {
  const snakeParts = [...snake];
  let [x, y] = snake[snake.length - 1];

  switch (direction) {
    case Direction.UP:
      y = y - 1 < 0 ? 14 : y - 1;
      break;
    case Direction.DOWN:
      y = y + 1 > 14 ? 0 : y + 1;
      break;
    case Direction.LEFT:
      x = x - 1 < 0 ? 14 : x - 1;
      break;
    case Direction.RIGHT:
      x = x + 1 > 14 ? 0 : x + 1;
      break;
  }

  snakeParts.push([x, y]);

  const [foodX, foodY] = food || [];
  let newFood: SnakePart | null = food;

  if (foodX !== x || foodY !== y) {
    snakeParts.shift();
  } else {
    newFood = null;
  }

  if (snake.some(part => part[0] === x && part[1] === y)) {
    throw new Error();
  }

  return [snakeParts, newFood];
}

/** Мап кода кнопки в доступное направление */
export function keycodeToDirection(current: Direction, code: number): Direction {
  if (code === 37 && current !== Direction.RIGHT) {
    return Direction.LEFT;
  }

  if (code === 38 && current !== Direction.DOWN) {
    return Direction.UP;
  }

  if (code === 39 && current !== Direction.LEFT) {
    return Direction.RIGHT;
  }

  if (code === 40 && current !== Direction.UP) {
    return Direction.DOWN;
  }

  return current;
}
