import { flatten, range } from "lodash";
import { Cell, Coordinate, GameStatus } from "../types";
import { getRandomInt, MINES_COUNT, X_SIZE, Y_SIZE } from "./utils";

export class GameLogic {
  private static instance: GameLogic;
  private gameStatus: GameStatus;
  private readonly grid: Cell[][];
  private readonly mines: Coordinate[];
  private readonly xSize: number;
  private readonly ySize: number;
  private readonly minesCount: number;

  // mark constructor as `private` to be sure
  // GameLogic won't be called as `new GameLogic()`
  private constructor() {
    this.ySize = Y_SIZE;
    this.xSize = X_SIZE;
    this.minesCount = MINES_COUNT;
    this.gameStatus = GameStatus.IN_PROGRESS;
    this.mines = this.getRandomMinesCoordinates();
    // create a grid with mines and calculated adjacent mines count
    this.grid = range(this.ySize).map((y) =>
      range(this.xSize).map((x) => ({
        adjacentMinesCount: this.getAdjacentMinesCount(
          this.getAdjacentCellsCoordinates(y, x)
        ),
        hasMine: this.getIsCellMine(y, x),
        isOpen: false,
      }))
    );
  }

  public getGameStatus = (): GameStatus => this.gameStatus;
  public getGrid = (): Cell[][] => this.grid;

  // provide GameLogic as Singleton
  public static getInstance = (): GameLogic => {
    if (!GameLogic.instance) {
      GameLogic.instance = new GameLogic();
    }

    return GameLogic.instance;
  };

  private getIsCellMine = (y: number, x: number): boolean =>
    this.mines.some(([mineY, mineX]) => y === mineY && x === mineX);

  private getRandomMinesCoordinates = (): Coordinate[] => {
    const mines: Coordinate[] = [];

    while (mines.length < this.minesCount) {
      const randomY = getRandomInt(0, this.ySize - 1);
      const randomX = getRandomInt(0, this.xSize - 1);

      // make sure there is no duplicates
      if (!mines.some(([y, x]) => y === randomY && x === randomX)) {
        mines.push([randomY, randomX]);
      }
    }

    return mines;
  };

  private getAdjacentCellsCoordinates = (y: number, x: number): Coordinate[] =>
    (
      [
        [y, x - 1],
        [y, x + 1],
        [y - 1, x],
        [y - 1, x - 1],
        [y - 1, x + 1],
        [y + 1, x],
        [y + 1, x - 1],
        [y + 1, x + 1],
      ] as Coordinate[]
    ).filter(
      ([y, x]) => y >= 0 && y <= this.ySize - 1 && x >= 0 && x <= this.xSize - 1
    );

  private getAdjacentMinesCount = (adjacentCoordinates: Coordinate[]): number =>
    adjacentCoordinates.reduce((acc, [y, x]) => {
      if (this.getIsCellMine(y, x)) {
        return acc + 1;
      }

      return acc;
    }, 0);

  private openCell = (y: number, x: number): void => {
    this.grid[y][x].isOpen = true;
  };

  private openAllCells = (): void => {
    this.grid.forEach((row, y) => row.forEach((_, x) => this.openCell(y, x)));
  };

  private openCellsWithoutAdjacentMines = (y: number, x: number): void => {
    const coordinates = this.getAdjacentCellsCoordinates(y, x);

    coordinates.forEach(([y, x]) => {
      const { adjacentMinesCount, hasMine, isOpen } = this.grid[y][x];

      if (!isOpen && !hasMine) {
        this.openCell(y, x);

        if (adjacentMinesCount === 0) {
          // if cell has zero adjacent mines recursively check adjacent cells
          this.openCellsWithoutAdjacentMines(y, x);
        }
      }
    });
  };

  public handleCellClick = (y: number, x: number): void => {
    if ([GameStatus.LOSE, GameStatus.WON].includes(this.gameStatus)) {
      return;
    }

    const { hasMine, adjacentMinesCount } = this.grid[y][x];

    this.openCell(y, x);

    if (hasMine) {
      this.gameStatus = GameStatus.LOSE;
      this.openAllCells();

      return;
    }

    if (adjacentMinesCount === 0) {
      this.openCellsWithoutAdjacentMines(y, x);
    }

    const onlyMinesRemainedClosed =
      flatten(this.grid).filter(({ isOpen }) => !isOpen).length ===
      this.minesCount;

    if (onlyMinesRemainedClosed) {
      this.gameStatus = GameStatus.WON;
      this.openAllCells();
    }
  };
}
