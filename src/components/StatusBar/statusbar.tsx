import Smiley from '../../assets/minesweeper-smiley.png';
import Sunglasses from '../../assets/minesweeper-sunglasses.png';
import Dead from '../../assets/minesweeper-dead.png';
import CatSmiley from '../../assets/cat-smiley.png';
import CatDead from '../../assets/cat-dead.png';
import CatSunglasses from '../../assets/cat-sunglasses.png';

import { GameStatus } from '../../shared/constants';
import './statusbar.css';

interface StatusBarProps {
  numRemainingMines: number;
  gameStatus: GameStatus;
  elapsedTime: number;
  setIsNewGame: Function;
  isCatMode: boolean;
}

const StatusBar = ({ gameStatus, numRemainingMines, elapsedTime, setIsNewGame, isCatMode }: StatusBarProps) => {
  const getStatusImage = () => {
    switch (gameStatus) {
      case GameStatus.InProgress:
        return isCatMode ? CatSmiley : Smiley;
      case GameStatus.Lost:
        return isCatMode ? CatDead : Dead;
      case GameStatus.Won:
        return isCatMode ? CatSunglasses : Sunglasses;
      default:
        return null;
    }
  };

  return (
    <div className="status-bar">
      <h2 className="status-text">
        {`Remaining mines: ${numRemainingMines}`}
      </h2>
      <button onClick={() => setIsNewGame(true)}>
        <img src={getStatusImage()} alt={`${gameStatus} image`} className="statusbar-image" />
      </button>
      <h2 className="status-text">
        {`Elapsed time: ${elapsedTime}`}
      </h2>
    </div>
  )

};

export default StatusBar;
