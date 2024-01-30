import { useEffect, useState } from "react";
import StatusBar from "../StatusBar/statusbar";
import GameSquare from "../GameSquare/gamesquare";
import { Cell, CellValues, GameBoardProps, GameState, GameStatus } from "../../shared/constants";
import './gameboard.css';

const GameBoard = ({
  numRows,
  numCols,
  numMines,
  isNewGame,
  setIsNewGame
}: GameBoardProps) => {
  const [gameState, setGameState] = useState<GameState>({
    gameBoard: [],
    numRemainingMines: 0,
    gameStatus: GameStatus.InProgress,
    isFirstClick: false,
    isTimerStarted: false,
    startTime: 0,
    elapsedTime: 0
  });

  useEffect(() => {
    if (isNewGame) {
      initializeGameBoard();
    }
  }, [isNewGame]);

  useEffect(() => {
    checkGameState();
  }, [gameState.gameBoard]);

  useEffect(() => {
    initializeGameBoard();
  }, []);

  useEffect(() => {
    let intervalId;
  
    if (gameState.isTimerStarted && gameState.gameStatus === GameStatus.InProgress) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setGameState(prevState => ({ ...prevState, elapsedTime: elapsedSeconds }));
      }, 1000); // Update elapsed time every second
    }
  
    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts or the game ends
    };
  }, [gameState.isFirstClick, gameState.gameStatus]);

  const initializeGameBoard = () => {
    const newGameBoard: Cell[][] = Array(numRows).fill(null).map(() =>
      Array(numCols).fill(null).map(() => ({
          value: undefined,
          isRevealed: false,
          isFlagged: false,
          isDisabled: false,
          isLosingClick: false
        })
      )
    );

    setGameState({
      ...gameState,
      gameBoard: newGameBoard,
      numRemainingMines: numMines,
      gameStatus: GameStatus.InProgress,
      isFirstClick: true,
      startTime: 0,
      elapsedTime: 0
    });
    setIsNewGame(false);
  };

  // pass in first click x and y to avoid revealing a mine on the first click
  const setUpGameBoard = (firstClickX, firstClickY) => {
    const updatedGameBoard = gameState.gameBoard.map(row => row.slice());

    let numSetMines = 0;
    let setMinesNum = numMines;

    // populate board randomly with mines
    while (numSetMines < setMinesNum) {
      let randomXIndex = Math.floor(Math.random() * numCols);
      let randomYIndex = Math.floor(Math.random() * numRows);

      if (updatedGameBoard[randomYIndex][randomXIndex].value !== CellValues.Mine
          && randomXIndex !== firstClickX && randomYIndex !== firstClickY) {
        updatedGameBoard[randomYIndex][randomXIndex].value = CellValues.Mine;
        numSetMines++;
      }
    }
  
    // populate remaining board values based on mine placements
    updatedGameBoard.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell.value !== CellValues.Mine) {
          let neighboringMines = 0;
  
          for (let i = Math.max(0, y - 1); i <= Math.min(y + 1, numRows - 1); i++) {
            for (let j = Math.max(0, x - 1); j <= Math.min(x + 1, numCols - 1); j++) {
              if (updatedGameBoard[i][j].value === CellValues.Mine) {
                neighboringMines += 1;
              }
            }
          }
  
          if (neighboringMines === 0) {
            updatedGameBoard[y][x].value = CellValues.Zero;
          } else {
            updatedGameBoard[y][x].value = neighboringMines;
          }
        }
      })
    );
  
    setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard }));
  }

  const checkGameState = () => {
    const totalCells = numRows * numCols;
    let numRevealedCells = 0;
  
    gameState.gameBoard.forEach(row => {
      row.forEach(cell => {
        if (cell.isRevealed) {
          numRevealedCells++;
        }
      });
    });
  
    const numNonMineCells = totalCells - numMines;
    const numRemainingNonMineCells = numNonMineCells - numRevealedCells;
  
    if (numRemainingNonMineCells === 0) {
      setGameState(prevState => ({ ...prevState, gameStatus: GameStatus.Won }));
      const updatedGameBoard = gameState.gameBoard.map(row =>
        row.map(cell => ({ ...cell, isDisabled: true }))
      );
      setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard }));
      setIsNewGame(false);
    }
  }

  const onButtonClick = (cell, y, x) => {
    if (gameState.isFirstClick) {
      setUpGameBoard(x, y);
      setGameState(prevState => ({ ...prevState, isTimerStarted: true, isFirstClick: false }));

    }

    // lose state
    if (cell.value === CellValues.Mine) {
      const isRevealed = () => {
        if (cell.value === CellValues.Mine) {
          return true;
        } else if (cell.value !== CellValues.Mine && cell.isFlagged) {
          return true;
        } else {
          return cell.isRevealed;
        }
      }
      const updatedGameBoard = gameState.gameBoard.map(row =>
        row.map(cell => ({
          ...cell,
          isRevealed: isRevealed(),
          isDisabled: true
        }))
      );

      updatedGameBoard[y][x].isLosingClick = true;
      setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard, gameStatus: GameStatus.Lost }));
      setIsNewGame(false);
    }  else {
      // reveal neighboring cells
      const updatedGameBoard = gameState.gameBoard.map(row => row.slice());

      const revealNeighboringCells = (y, x) => {
        if (y < 0 || y >= numRows || x < 0 || x >= numCols || updatedGameBoard[y][x].isRevealed) {
          return;
        }
        updatedGameBoard[y][x].isRevealed = true;

        if (updatedGameBoard[y][x].value === CellValues.Zero) {
          revealNeighboringCells(y - 1, x - 1);
          revealNeighboringCells(y - 1, x);
          revealNeighboringCells(y - 1, x + 1);
          revealNeighboringCells(y, x - 1);
          revealNeighboringCells(y, x + 1);
          revealNeighboringCells(y + 1, x - 1);
          revealNeighboringCells(y + 1, x);
          revealNeighboringCells(y + 1, x + 1);
        }
      };

      revealNeighboringCells(y, x);
      setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard }));
    }
  }

  // place or remove a flag on right click
  const handleRightClick = (event, cell, y, x) => {
    event.preventDefault();

    if (!cell.isRevealed && gameState.gameStatus === GameStatus.InProgress) {
      const updatedRemainingMines = cell.isFlagged ? gameState.numRemainingMines + 1 : gameState.numRemainingMines - 1;
      setGameState(prevState => ({ ...prevState, numRemainingMines: updatedRemainingMines }));

      const updatedGameBoard = gameState.gameBoard.map(row => row.slice());
      updatedGameBoard[y][x].isFlagged = !cell.isFlagged;
      updatedGameBoard[y][x].isDisabled = !cell.isDisabled;
      setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard }));
    }
  };

  // reveal surrounding cells on double click
  const onDoubleClick = (cell, y, x) => {
    let numSurroundingFlags = 0;
    let unrevealed = [];
    
    for (let i = Math.max(0, y - 1); i <= Math.min(y + 1, numRows - 1); i++) {
      for (let j = Math.max(0, x - 1); j <= Math.min(x + 1, numCols - 1); j++) {
          if (gameState.gameBoard[i][j].isFlagged) {
            numSurroundingFlags++;
          } else {
            if (!gameState.gameBoard[i][j].isRevealed) {
              unrevealed.push([i, j]);
            }
          }
      }
    }
  
    if (numSurroundingFlags === cell.value) {
      const updatedGameBoard = gameState.gameBoard.map(row => row.slice());

      unrevealed.map((coord) => {
        updatedGameBoard[coord[0]][coord[1]].isRevealed = true;
      });

      setGameState(prevState => ({ ...prevState, gameBoard: updatedGameBoard }));
    }
  }

  return (
    <div className="gameboard-container">
      <StatusBar
        numRemainingMines={gameState.numRemainingMines}
        gameStatus={gameState.gameStatus}
        elapsedTime={gameState.elapsedTime}
        setIsNewGame={setIsNewGame}
      />

      <div className="gameboard">
        {gameState.gameBoard.map((row, y) => {
          return (
            <div className="row" key={`row${y}`}>
              {row.map((cell, x) => {
                return (
                  <GameSquare
                    key={`${x}${y}`}
                    cell={cell}
                    onButtonClick={onButtonClick}
                    handleRightClick={handleRightClick}
                    xCoord={x}
                    yCoord={y}
                    onDoubleClick={onDoubleClick}
                  />
                );
              })}
              </div>
          )
        } )}
      </div>
    </div>
  )
}

export default GameBoard;
