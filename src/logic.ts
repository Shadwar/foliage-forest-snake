import {createStore, createEvent, createEffect, sample, merge, forward, guard, combine} from 'effector';
import {Status, SnakePart, CellType, Direction} from './types';
import {moveSnake, populateCells, createFood, keycodeToDirection, tick} from './utils';

/** Первичная инициализация логики */
const init = createEvent();

/** Нажатие на клавишу управления */
export const keydown = createEvent<number>();

/** Игровой тик зависит от текущего счета */
const fxTick = createEffect({handler: tick});

/** Движение змеи */
const fxMove = createEffect({handler: moveSnake});

/** Текущий статус игры */
export const $status = createStore<Status>(Status.START)
  .on(keydown, (status) => (status === Status.START || status === Status.END) ? Status.WAIT : Status.RUN)
  .on(fxMove.fail, () => Status.END)

/** Направление движения змеи */
const $direction = createStore<Direction>(Direction.NONE)
  .reset(fxMove.fail);

/** Направление было изменено  */
const $directionChanged = createStore(false)
  .on($direction, () => true)
  .reset(fxMove.finally);

/** Клетки, занятые змеей */
const $snake = createStore<SnakePart[]>([[7, 7]])
  .on(fxMove.doneData, (_, [snake]) => snake)
  .reset(fxMove.fail);

/** Клетка с едой */
const $food = createStore<SnakePart | null>([7, 5]);

/** Текущий счет */
export const $score = createStore(0)
  .on(fxMove.doneData, (score, [_, food]) => food ? score : score + 1)
  .reset($status.updates.filter({fn: status => status === Status.WAIT}))

/** Игровое поле */
export const $cells = createStore<CellType[]>([]);

/** Выбрать направление движения, если за этот тик оно еще не произошло */
sample({
  source: $direction,
  clock: guard(keydown, {filter: $directionChanged.map(changed => !changed)}),
  target: $direction,
  fn: keycodeToDirection,
});

/** При изменении значений змеи или еды - пересчитать игровое поле */
sample({
  source: [$snake, $food],
  clock: merge([init, $snake.updates, $food.updates]),
  target: $cells,
  fn: populateCells
});

/** После движения змеи создать новую еду, если она её съела */
sample({
  source: $snake,
  clock: fxMove.doneData.map(([_, food]) => food),
  target: $food,
  fn: createFood,
})

/** На каждый тик игры взять необходимые значения и начать движения змеи */
sample({
  source: [$snake, $food, $direction],
  clock: fxTick,
  target: fxMove,
});

/** Запуск тика при смене статус или при окончании предыдущего тика */
sample({
  source: $score,
  clock: guard(
    merge([fxTick.done, $status.updates]),
    {filter: $status.map(status => status === Status.RUN)}
  ),
  target: fxTick,
});

init();
