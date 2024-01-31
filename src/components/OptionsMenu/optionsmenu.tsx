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
  const [selectedOption, setSelectedOption] = useState(Options.Beginner);
  const [isOpen, setIsOpen] = useState(false);
  const [customRows, setCustomRows] = useState("");
  const [customCols, setCustomCols] = useState("");
  const [customMines, setCustomMines] = useState("");
  const [isValidRows, setIsValidRows] = useState(true);
  const [isValidCols, setIsValidCols] = useState(true);
  const [isValidMines, setIsValidMines] = useState(true);

  const maxRows = 50;
  const maxCols = 50;
  const maxMines = 1000;
  const minCustomValue = 0;

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onSelectOption = (event) => {
    setSelectedOption(event.target.value);
    
    // reset custom options
    setCustomRows("");
    setCustomCols("");
    setCustomMines("");
    setIsValidRows(true);
    setIsValidCols(true);
    setIsValidMines(true);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const onCustomRowsChange = (event) => {
    const value = event.target.value.trim();
    setCustomRows(value);
    const isValid = isValidCustomInput(value, minCustomValue, maxRows);
    setIsValidRows(isValid);
  };

  const onCustomColsChange = (event) => {
    const value = event.target.value.trim();
    setCustomCols(value);
    const isValid = isValidCustomInput(value, minCustomValue, maxCols);
    setIsValidCols(isValid);
  };

  const onCustomMinesChange = (event) => {
    const value = event.target.value.trim();
    setCustomMines(value);
    const isValid = isValidCustomInput(value, minCustomValue, maxMines);
    setIsValidMines(isValid);
  };

  const isValidCustomInput = (selectedValue, min, max) => {
    if (selectedValue === "") {
      return true; // Allow empty value
    }
    const numValue = parseInt(selectedValue, 10);
    return !isNaN(numValue) && numValue >= min && numValue <= max;
  }

  const isStartDisabled = () => {
    if (selectedOption === Options.Custom && (!customCols || !customRows || !customMines || !isValidCols || !isValidRows || !isValidMines)) {
      return true;
    } else {
      return false;
    }
  }

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
        rows = parseInt(customRows, 10);
        cols = parseInt(customCols, 10);
        mines = parseInt(customMines, 10);
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
                    {selectedOption === Options.Custom && 
                      <div className="custom-options">
                        <label>Rows (max 50):</label>
                        <input
                          type="number"
                          value={customRows}
                          min={minCustomValue}
                          max={maxRows}
                          onChange={onCustomRowsChange}
                          className={!isValidRows && customRows ? 'error' : ''}
                        />
                        <label>Columns (max 50):</label>
                        <input
                          type="number"
                          value={customCols}
                          min={minCustomValue}
                          max={maxCols}
                          onChange={onCustomColsChange}
                          className={!isValidCols && customCols ? 'error' : ''}
                        />
                        <label>Mines (max 1000):</label>
                        <input
                          type="number"
                          value={customMines}
                          min={minCustomValue}
                          max={maxMines}
                          onChange={onCustomMinesChange}
                          className={!isValidMines && customMines ? 'error' : ''}
                        />
                      </div>
                    }
                  </>
                ) : (
                  option
                )}
            </label>
          ))}
          <button
            className="options-menu-button"
            onClick={onStartNewGame}
            disabled={isStartDisabled()}
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsMenu;
