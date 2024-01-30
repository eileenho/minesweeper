export enum GameStatus {
  InProgress = "in progress",
  Lost = "lost",
  Won = "won"
}

export enum CellValues {
  Mine = "M",
  Flag = "F",
  Zero = " "
}

export interface Cell {
  value: CellValues | number;
  isRevealed: boolean;
  isFlagged: boolean;
  isDisabled: boolean;
  isLosingClick: boolean;
}

export interface GameBoardProps {
  numRows: number;
  numCols: number;
  numMines: number;
  isCatMode: boolean;
  isNewGame: boolean;
  setIsNewGame: (isNewGame: boolean) => void;
}

export interface GameState {
  gameBoard: Cell[][];
  numRemainingMines: number;
  gameStatus: GameStatus;
  isFirstClick: boolean;
  isTimerStarted: boolean;
  startTime: number;
  elapsedTime: number;
}