import { useEffect, useState } from "react";
import './App.css';
import GameBoard from "./components/GameBoard/gameboard";
import OptionsMenu from "./components/OptionsMenu/optionsmenu";

function App() {
  const [numRows, setNumRows] = useState(9);
  const [numCols, setNumCols] = useState(9);
  const [numMines, setNumMines] = useState(10);
  const [isNewGame, setIsNewGame] = useState(false);

  return (
    <div className="app-container">
      <div className="app-title-row">
        <h1>
          Minesweeper
        </h1>
        <OptionsMenu
          setNumRows={setNumRows}
          setNumCols={setNumCols}
          setNumMines={setNumMines}
          setIsNewGame={setIsNewGame}
        />
      </div>

      <GameBoard
        numRows={numRows}
        numCols={numCols}
        numMines={numMines}
        isNewGame={isNewGame}
        setIsNewGame={setIsNewGame}
      />
    </div>
  );
}

export default App;
