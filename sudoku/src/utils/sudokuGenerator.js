// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Проверка, можно ли поставить число в клетку
function isValid(board, row, col, num) {
  // Проверка строки
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }
  // Проверка столбца
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }
  // Проверка квадрата 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
}

// Поиск пустой клетки (возвращает [row, col] или null)
function findEmpty(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return null;
}

// Алгоритм обратного хода (backtracking) для решения
function solveSudoku(board) {
  const empty = findEmpty(board);
  if (!empty) return true;
  const [row, col] = empty;
  
  // Пробуем числа в случайном порядке
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  
  for (const num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

// ========== ОСНОВНЫЕ ФУНКЦИИ ==========

// Создание пустого поля 9x9
function createEmptyBoard() {
  return Array(9).fill().map(() => Array(9).fill(0));
}

// Генерация полностью заполненного судоку
function generateFullBoard() {
  const board = createEmptyBoard();
  solveSudoku(board);
  return board;
}

// Удаление клеток с сохранением уникальности решения
function removeCells(board, cellsToRemove) {
  const puzzle = board.map(row => [...row]);
  const removed = [];
  
  // Создаём список всех клеток и перемешиваем
  const allCells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      allCells.push([i, j]);
    }
  }
  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
  }
  
  // Удаляем клетки
  let removedCount = 0;
  for (const [row, col] of allCells) {
    if (removedCount >= cellsToRemove) break;
    
    const originalValue = puzzle[row][col];
    puzzle[row][col] = 0;
    
    // Проверяем, что решение осталось уникальным
    const testBoard = puzzle.map(r => [...r]);
    const solutions = [];
    
    // Быстрая проверка (достаточно найти 2 решения)
    function countSolutions(board, limit = 2) {
      const empty = findEmpty(board);
      if (!empty) return 1;
      const [row, col] = empty;
      let count = 0;
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
          board[row][col] = num;
          count += countSolutions(board, limit - count);
          board[row][col] = 0;
          if (count >= limit) break;
        }
      }
      return count;
    }
    
    const solutionCount = countSolutions(testBoard);
    if (solutionCount !== 1) {
      // Если решение не уникально, возвращаем цифру обратно
      puzzle[row][col] = originalValue;
    } else {
      removedCount++;
    }
  }
  
  return puzzle;
}

// ========== ГЛАВНАЯ ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ СУДОКУ ==========

/**
 * Генерирует судоку заданной сложности
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {number[][]} - поле 9x9 с нулями вместо пустых клеток
 */
export function generateSudoku(difficulty = 'medium') {
  const fullBoard = generateFullBoard();
  
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 35; // 46 заполненных клеток
      break;
    case 'medium':
      cellsToRemove = 45; // 36 заполненных клеток
      break;
    case 'hard':
      cellsToRemove = 55; // 26 заполненных клеток
      break;
    default:
      cellsToRemove = 45;
  }
  
  return removeCells(fullBoard, cellsToRemove);
}

// Функция для получения решения (если понадобится)
export function getSolution(puzzle) {
  const solution = puzzle.map(row => [...row]);
  solveSudoku(solution);
  return solution;
}