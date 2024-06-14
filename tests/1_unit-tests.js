const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  // Test data
  const validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidCharPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3x.';
  const shortPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
  const unsolvablePuzzleString = '1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const validSolutionString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

  // Validate function tests
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isNull(solver.validate(validPuzzleString));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate(invalidCharPuzzleString), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(shortPuzzleString), { error: 'Expected puzzle to be 81 characters long' });
  });

  // Check row placement tests
  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzleString, 0, 0, '7'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzleString, 0, 0, '5'));
  });

  // Check column placement tests
  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 0, 0, '7'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 0, 0, '9'));
  });

  // Check region placement tests
  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 0, 0, '7'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzleString, 0, 0, '9'));
  });

  // Solver function tests
  test('Valid puzzle strings pass the solver', () => {
    assert.deepEqual(solver.solve(validPuzzleString), { solution: validSolutionString });
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.deepEqual(solver.solve(invalidCharPuzzleString), { error: 'Invalid characters in puzzle' });
    assert.deepEqual(solver.solve(shortPuzzleString), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.deepEqual(solver.solve(validPuzzleString), { solution: validSolutionString });
  });
});

