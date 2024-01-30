import { useState, useEffect, useRef } from 'react';
import './optionsmenu.css';

interface MenuProps {
  setNumRows: (rows: number) => void;
  setNumCols: (cols: number) => void;
  setNumMines: (mines: number) => void;
  setIsNewGame: (isNewGame: boolean) => void;
}

enum Options {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Expert = "expert",
  Custom = "custom"
}

const OptionsMenu = ({
  setNumRows,
  setNumCols,
  setNumMines,
  setIsNewGame
}: MenuProps) => {
  const menuRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState("beginner");
  const [isOpen, setIsOpen] = useState(false);
  const [customRows, setCustomRows] = useState(9);
  const [customCols, setCustomCols] = useState(9);
  const [customMines, setCustomMines] = useState(10);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onSelectOption = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const onStartNewGame = () => {
    let rows, cols, mines;

    switch (selectedOption) {
      case Options.Beginner:
        rows = 9;
        cols = 9;
        mines = 10;
        break;
      case Options.Intermediate:
        rows = 16;
        cols = 16;
        mines = 40;
        break;
      case Options.Expert:
        rows = 16;
        cols = 30;
        mines = 99;
        break;
      case Options.Custom:
        rows = customRows;
        cols = customCols;
        mines = customMines;
        break;
      default:
        return; 
    }

    setNumRows(rows);
    setNumCols(cols);
    setNumMines(mines);
    setIsNewGame(true);
    setIsOpen(false);
  };

  return (
    <div className="options-menu" ref={menuRef}>
      <button className="options-menu-button" onClick={toggleMenu}>
        {selectedOption}
      </button>
      {isOpen && (
        <div className="options-menu-list">
          {Object.values(Options).map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={onSelectOption}
              />
                {option === Options.Custom ? (
                  <>{option}
                    <div className="custom-options">
                      <label>Rows:</label>
                      <input
                        type="number"
                        value={customRows}
                        min={1}
                        max={50}
                        onChange={(event) => setCustomRows(Number(event.target.value)) }
                      />
                      <label>Columns:</label>
                      <input
                        type="number"
                        value={customCols}
                        min={1}
                        max={50}
                        onChange={(event) => setCustomCols(Number(event.target.value)) }
                      />
                      <label>Mines:</label>
                      <input
                        type="number"
                        value={customMines}
                        min={1}
                        max={(customRows - 1) * (customCols - 1)}
                        onChange={(event) => setCustomMines(Number(event.target.value)) }
                      />
                    </div>
                  </>
                ) : (
                  option
                )}
            </label>
          ))}
          <button className="options-menu-button" onClick={onStartNewGame}>Start</button>
        </div>
      )}
    </div>
  );
};

export default OptionsMenu;
