'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate coordinate
      const row = coordinate[0].toUpperCase();
      const column = coordinate[1];
      if (!/[A-I]/.test(row) || !/[1-9]/.test(column) || coordinate.length !== 2) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const colIndex = parseInt(column, 10) - 1;

      if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const validateError = solver.validate(puzzle);
      if (validateError) return res.json(validateError);

      if (puzzle[rowIndex * 9 + colIndex] === value) {
        return res.json({ valid: true });
      }

      const validRow = solver.checkRowPlacement(puzzle, rowIndex, colIndex, value);
      const validCol = solver.checkColPlacement(puzzle, rowIndex, colIndex, value);
      const validRegion = solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value);

      if (validRow && validCol && validRegion) {
        return res.json({ valid: true });
      } else {
        const conflicts = [];
        if (!validRow) conflicts.push('row');
        if (!validCol) conflicts.push('column');
        if (!validRegion) conflicts.push('region');
        return res.json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      res.json(result);
    });
};
