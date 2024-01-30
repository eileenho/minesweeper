import Flag from '../../assets/minesweeper-flag.png';
import Mine from '../../assets/minesweeper-bomb.png';
import XMine from '../../assets/minesweeper-bomb-x.png';
import './gamesquare.css';
import { Cell, CellValues } from '../../shared/constants';

interface GameSquareProps {
  cell: Cell,
  xCoord: number;
  yCoord: number;
  onButtonClick: Function;
  handleRightClick: Function;
  onDoubleClick: Function;
}

const GameSquare = ({ cell,
  xCoord,
  yCoord,
  handleRightClick,
  onButtonClick,
  onDoubleClick
} : GameSquareProps) => {
  const cellClass = `cell ${cell.isRevealed ? 'isRevealed' : ''} ${cell.value ? `_${cell.value}` : ''}`;

  const displayValue = () => {
    if (cell.isFlagged) {
      if (cell.value !== CellValues.Mine && cell.isRevealed) {
        return <img src={XMine} className="mine-image" alt="wrong flag"/>
       } else {
        return <img src={Flag} className="flag-image" alt="flag"/>;
       }
    } else if (cell.isRevealed && cell.value === CellValues.Mine) {
      return <img src={Mine} className={`mine-image ${cell.isLosingClick ? 'red-background' : ''}`} alt="mine" />
    } else if (cell.isRevealed) {
      return cell.value;
    }
  }

  return (
    <button
      className={cellClass}
      onClick={() => onButtonClick(cell, yCoord, xCoord)}
      onContextMenu={(event) => handleRightClick(event, cell, yCoord , xCoord)}
      disabled={cell.isDisabled}
      onDoubleClick={() => onDoubleClick(cell, yCoord, xCoord)}
    >

      {displayValue()}
    </button>
  )
};

export default GameSquare;