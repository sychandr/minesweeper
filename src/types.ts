export type Cell = {
  adjacentMinesCount: number;
  hasMine: boolean;
  isOpen: boolean;
};

export type Coordinate = [y: number, x: number];

export enum GameStatus {
  IN_PROGRESS,
  WON,
  LOSE,
}
