class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    return null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const rowValues = puzzleString.slice(start, start + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(regionRow + r) * 9 + regionCol + c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateError = this.validate(puzzleString);
    if (validateError) return validateError;

    const solveHelper = (board) => {
      const emptyIndex = board.indexOf('.');
      if (emptyIndex === -1) return board;

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (this.checkRowPlacement(board, row, col, value) &&
            this.checkColPlacement(board, row, col, value) &&
            this.checkRegionPlacement(board, row, col, value)) {
          const newBoard = board.slice(0, emptyIndex) + value + board.slice(emptyIndex + 1);
          const result = solveHelper(newBoard);
          if (result) return result;
        }
      }
      return null;
    };

    const solvedBoard = solveHelper(puzzleString);
    if (!solvedBoard) return { error: 'Puzzle cannot be solved' };

    return { solution: solvedBoard };
  }
}

module.exports = SudokuSolver;


