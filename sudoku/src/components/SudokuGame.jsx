import React, { useState, useEffect, useCallback } from 'react';
import { generateSudoku, getSolution } from '../utils/sudokuGenerator';
import styles from '../styles/SudokuGame.module.css';

const SudokuGame = ({ difficulty, category, onComplete, onBack }) => {
  const [puzzle, setPuzzle] = useState([]);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [message, setMessage] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [usedCount, setUsedCount] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const updateUsedCount = (newBoard) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = newBoard[i][j];
        if (val !== 0) {
          counts[val]++;
        }
      }
    }
    setUsedCount(counts);
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    if (board.length > 0) {
      updateUsedCount(board);
    }
  }, [board]);

  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

  const handleKeyPress = useCallback((event) => {
    if (!isGameActive) return;
    
    const key = event.key;
    
    if (key >= '1' && key <= '9') {
      const num = parseInt(key);
      setSelectedNumber(num);
      if (selectedCell) {
        handleNumberInput(num);
      } else {
        showToast(`Выбрана цифра ${num}. Кликните на клетку`, 'info');
      }
      event.preventDefault();
    }
    else if (key === 'Delete' || key === 'Backspace') {
      setSelectedNumber(null);
      if (selectedCell) {
        handleNumberInput(0);
      }
      event.preventDefault();
    }
    else if (key.startsWith('Arrow')) {
      navigateCell(key);
      event.preventDefault();
    }
  }, [selectedCell, isGameActive, selectedNumber]);

  const navigateCell = (key) => {
    if (!selectedCell) {
      setSelectedCell([0, 0]);
      setToastMessage(null);
      return;
    }
    
    let [row, col] = selectedCell;
    
    switch (key) {
      case 'ArrowUp':
        row = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        row = Math.min(8, row + 1);
        break;
      case 'ArrowLeft':
        col = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        col = Math.min(8, col + 1);
        break;
      default:
        return;
    }
    
    setToastMessage(null);
    setSelectedCell([row, col]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const startNewGame = () => {
    const newPuzzle = generateSudoku(difficulty);
    const newSolution = getSolution(newPuzzle);
    
    setPuzzle(newPuzzle.map(row => [...row]));
    setBoard(newPuzzle.map(row => [...row]));
    setSolution(newSolution.map(row => [...row]));
    setTimer(0);
    setErrors(0);
    setIsGameActive(true);
    setSelectedCell(null);
    setSelectedNumber(null);
    setHintsUsed(0);
    setMessage('');
    setToastMessage(null);
  };

  const isOriginalCell = (row, col) => {
    return puzzle[row][col] !== 0;
  };

  // НОВАЯ ФУНКЦИЯ: проверка, является ли клетка правильно введённой пользователем
  const isCorrectUserCell = (row, col) => {
    const value = board[row][col];
    if (value === 0) return false;
    // Если это не исходная клетка и цифра правильная
    if (!isOriginalCell(row, col) && solution[row][col] === value) {
      return true;
    }
    return false;
  };

  // Проверка, можно ли редактировать клетку
  const isEditableCell = (row, col) => {
    // Исходные клетки нельзя редактировать
    if (isOriginalCell(row, col)) return false;
    // Правильные клетки, введённые пользователем, тоже нельзя редактировать
    if (isCorrectUserCell(row, col)) return false;
    // Неправильные клетки и пустые — можно редактировать
    return true;
  };

  const isCorrectNumber = (row, col) => {
    const value = board[row][col];
    if (value === 0) return true;
    return solution[row][col] === value;
  };

  const canInsertNumber = (num) => {
    if (usedCount[num] >= 9) return false;
    return true;
  };

  const handleNumberInput = (num) => {
    if (!isGameActive) return;
    if (!selectedCell) {
      showToast('Сначала выберите клетку', 'warning');
      return;
    }
    
    const [row, col] = selectedCell;
    
    // Проверяем, можно ли редактировать клетку
    if (!isEditableCell(row, col)) {
      if (isOriginalCell(row, col)) {
        showToast('Исходную цифру нельзя изменить', 'warning');
      } else if (isCorrectUserCell(row, col)) {
        showToast('Правильную цифру нельзя изменить (она верна)', 'info');
      }
      return;
    }
    
    if (num === 0) {
      const newBoard = [...board];
      newBoard[row][col] = 0;
      setBoard(newBoard);
      return;
    }
    
    if (!canInsertNumber(num) && board[row][col] !== num) {
      showToast(`Цифра ${num} уже использована 9 раз!`, 'warning');
      return;
    }
    
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);
    
    if (solution[row][col] === num) {
      checkCompletion(newBoard);
    } else {
      setErrors(prev => prev + 1);
      showToast(`Ошибка! Число ${num} не подходит (можно исправить)`, 'error');
      
      const cellElement = document.getElementById(`cell-${row}-${col}`);
      if (cellElement) {
        cellElement.classList.add(styles.errorFlash);
        setTimeout(() => {
          cellElement.classList.remove(styles.errorFlash);
        }, 300);
      }
    }
  };

  const checkCompletion = (currentBoard) => {
    const isComplete = currentBoard.every((row, rowIndex) => 
      row.every((cell, colIndex) => {
        if (cell === 0) return false;
        return solution[rowIndex][colIndex] === cell;
      })
    );
    
    if (isComplete) {
      setIsGameActive(false);
      const gameData = {
        category: category.name,
        difficulty: difficulty,
        time: timer,
        errors: errors,
        hintsUsed: hintsUsed,
        completed: true
      };
      onComplete(gameData);
    }
  };

  const handleHint = () => {
    if (!isGameActive) return;
    if (!selectedCell) {
      showToast('Сначала выберите клетку', 'warning');
      return;
    }
    
    const [row, col] = selectedCell;
    
    if (!isEditableCell(row, col)) {
      if (isOriginalCell(row, col)) {
        showToast('Эта клетка уже заполнена правильно', 'info');
      } else if (isCorrectUserCell(row, col)) {
        showToast('В этой клетке уже правильное число', 'info');
      }
      return;
    }
    
    const correctNumber = solution[row][col];
    const newBoard = [...board];
    newBoard[row][col] = correctNumber;
    setBoard(newBoard);
    setHintsUsed(prev => prev + 1);
    
    showToast(`💡 Подсказка: число ${correctNumber}`, 'success');
    
    checkCompletion(newBoard);
  };

  const handleNewGame = () => {
    startNewGame();
  };

  const getCellClass = (row, col) => {
    const classes = [styles.cell];
    
    if (isOriginalCell(row, col)) {
      classes.push(styles.original);
    } else if (board[row][col] !== 0) {
      classes.push(styles.userInput);
      if (!isCorrectNumber(row, col)) {
        classes.push(styles.wrongNumber);
      } else if (isCorrectUserCell(row, col)) {
        classes.push(styles.correctUserCell); // Новый стиль для правильных пользовательских цифр
      }
    }
    
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      classes.push(styles.selected);
    }
    
    if (selectedCell) {
      const [sRow, sCol] = selectedCell;
      if (sRow === row || sCol === col) {
        classes.push(styles.highlightRowCol);
      }
      if (Math.floor(sRow / 3) === Math.floor(row / 3) && 
          Math.floor(sCol / 3) === Math.floor(col / 3)) {
        classes.push(styles.highlightBox);
      }
    }
    
    if (selectedCell && board[row][col] !== 0) {
      const [sRow, sCol] = selectedCell;
      const selectedValue = board[sRow][sCol];
      const currentValue = board[row][col];
      
      if (selectedValue !== 0 && currentValue === selectedValue && 
          !(selectedCell[0] === row && selectedCell[1] === col)) {
        classes.push(styles.sameNumber);
      }
    }
    
    return classes.join(' ');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderRightPanel = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div className={styles.rightPanel}>
        <div className={styles.panelTitle}>Цифры</div>
        <div className={styles.numberGrid}>
          {numbers.map(num => {
            const isDisabled = usedCount[num] >= 9;
            const isSelected = selectedNumber === num;
            return (
              <button
                key={num}
                className={`${styles.panelNumber} ${isSelected ? styles.panelNumberSelected : ''} ${isDisabled ? styles.panelNumberDisabled : ''}`}
                onClick={() => {
                  setSelectedNumber(num);
                  if (selectedCell) {
                    handleNumberInput(num);
                  } else {
                    showToast(`Выбрана цифра ${num}. Кликните на клетку`, 'info');
                  }
                }}
                disabled={isDisabled}
              >
                {num}
                {isDisabled && <span className={styles.panelCompleteBadge}>✓</span>}
              </button>
            );
          })}
        </div>
        <button
          className={`${styles.panelDelete} ${selectedNumber === null ? styles.panelDeleteSelected : ''}`}
          onClick={() => {
            setSelectedNumber(null);
            if (selectedCell && isEditableCell(selectedCell[0], selectedCell[1])) {
              handleNumberInput(0);
            } else if (selectedCell) {
              showToast('Эту клетку нельзя очистить', 'warning');
            }
          }}
        >
          ⌫ Очистить
        </button>
        <div className={styles.panelHint}>
          💡 Выберите цифру, затем кликните на клетку
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Назад
        </button>
        <div className={styles.gameInfo}>
          <div className={styles.category}>
            {category.icon} {category.name}
          </div>
          <div className={styles.stats}>
            <span>⏱️ {formatTime(timer)}</span>
            <span>❌ {errors}</span>
            <span>💡 {hintsUsed}</span>
          </div>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.boardWrapper}>
          <div className={styles.board}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    id={`cell-${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    onClick={() => {
                      setToastMessage(null);
                      setSelectedCell([rowIndex, colIndex]);
                      if (selectedNumber && isEditableCell(rowIndex, colIndex)) {
                        handleNumberInput(selectedNumber);
                      } else if (selectedNumber && !isEditableCell(rowIndex, colIndex)) {
                        if (isOriginalCell(rowIndex, colIndex)) {
                          showToast('Исходную цифру нельзя изменить', 'warning');
                        } else if (isCorrectUserCell(rowIndex, colIndex)) {
                          showToast('Правильную цифру нельзя изменить (она верна)', 'info');
                        }
                      }
                    }}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.rightPanelContainer}>
          {renderRightPanel()}
          {toastMessage && (
            <div className={`${styles.toast} ${styles[toastMessage.type]}`}>
              {toastMessage.text}
            </div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.hintButton} onClick={handleHint}>
          💡 Подсказка
        </button>
        <button className={styles.howToPlayButton} onClick={() => setShowHowToPlay(true)}>
          📘 Как играть
        </button>
        <button className={styles.newGameButton} onClick={handleNewGame}>
          🎲 Новая игра
        </button>
      </div>

      <div className={styles.keyboardHint}>
        💡 Используйте клавиатуру (1-9, Delete/Backspace, стрелки) или выбирайте цифры справа
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      {showHowToPlay && (
        <div className={styles.modalOverlay} onClick={() => setShowHowToPlay(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowHowToPlay(false)}>
              ✕
            </button>
            <h2 className={styles.modalTitle}>📘 Как играть в судоку</h2>
            
            <div className={styles.modalSection}>
              <h3>🎯 Цель игры</h3>
              <p>Заполните все клетки цифрами от 1 до 9 так, чтобы:</p>
              <ul>
                <li>В каждой строке цифры не повторялись</li>
                <li>В каждом столбце цифры не повторялись</li>
                <li>В каждом квадрате 3×3 цифры не повторялись</li>
              </ul>
            </div>

            <div className={styles.modalSection}>
              <h3>🎮 Управление</h3>
              <ul>
                <li><strong>Клик</strong> по клетке — выбрать клетку</li>
                <li><strong>Цифры справа</strong> — выберите цифру, затем кликните на клетку</li>
                <li><strong>Цифры 1-9</strong> на клавиатуре — вставить число</li>
                <li><strong>Delete / Backspace</strong> — очистить клетку</li>
                <li><strong>Стрелки</strong> — перемещаться по полю</li>
                <li><strong>💡 Подсказка</strong> — показывает правильное число</li>
              </ul>
            </div>

            <div className={styles.modalSection}>
              <h3>🎨 Визуальные подсказки</h3>
              <ul>
                <li><span className={styles.exampleOriginal}>Тёмные цифры</span> — заданы изначально (нельзя менять)</li>
                <li><span className={styles.exampleUser}>Синие цифры</span> — введены вами (правильные — нельзя менять)</li>
                <li><span className={styles.exampleWrong}>Красные цифры</span> — неправильные (можно исправить)</li>
                <li>При выборе клетки подсвечиваются строка, столбец и квадрат 3×3</li>
                <li>Все одинаковые цифры подсвечиваются оранжевой рамкой</li>
              </ul>
            </div>

            <button className={styles.modalButton} onClick={() => setShowHowToPlay(false)}>
              Начать игру
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;