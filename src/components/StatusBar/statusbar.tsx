import Smiley from '../../assets/minesweeper-smiley.png';
import Sunglasses from '../../assets/minesweeper-sunglasses.png';
import Dead from '../../assets/minesweeper-dead.png';
import { GameStatus } from '../../shared/constants';
import './statusbar.css';

interface StatusBarProps {
  numRemainingMines: number;
  gameStatus: GameStatus;
  elapsedTime: number;
  setIsNewGame: Function;
}

const StatusBar = ({ gameStatus, numRemainingMines, elapsedTime, setIsNewGame }: StatusBarProps) => {
  const getStatusImage = () => {
    switch (gameStatus) {
      case GameStatus.InProgress:
        return Smiley;
      case GameStatus.Lost:
        return Dead;
      case GameStatus.Won:
        return Sunglasses;
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
