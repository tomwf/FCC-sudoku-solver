const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver()
const {
  validate,
  checkRowPlacement,
  checkColPlacement,
  checkRegionPlacement,
  solve
} = solver

let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

suite('UnitTests', () => {
  suite('validate()', () => {
    test('valid characters', () => {
      assert.isUndefined(validate(validPuzzleString))
    })

    test('invalid length', () => {
      assert.strictEqual(validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'), 'Expected puzzle to be 81 characters long')
    })

    test('invalid characters', () => {
      assert.strictEqual(validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a'), 'Invalid characters in puzzle')
    })
  })

  suite('checkRowPlacement()', () => {
    test('valid value in row', () => {
      assert.isUndefined(checkRowPlacement(validPuzzleString, 'A', 1, 7))
      assert.isUndefined(checkRowPlacement(validPuzzleString, 'D', 7, 2))
      assert.isUndefined(checkRowPlacement(validPuzzleString, 'G', 5, 5))
    })

    test('invalid row placement', () => {
      assert.strictEqual(checkRowPlacement(validPuzzleString, 'A', 1, 1), 'row')
      assert.strictEqual(checkRowPlacement(validPuzzleString, 'D', 4, 8), 'row')
      assert.strictEqual(checkRowPlacement(validPuzzleString, 'H', 7, 5), 'row')
    })
  })

  suite('checkColPlacement()', () => {
    test('valid value in column', () => {
      assert.isUndefined(checkColPlacement(validPuzzleString, 'A', 1, 7))
      assert.isUndefined(checkRowPlacement(validPuzzleString, 'E', 4, 8))
      assert.isUndefined(checkColPlacement(validPuzzleString, 'E', 8, 2))
    })

    test('invalid value in column', () => {
      assert.strictEqual(checkColPlacement(validPuzzleString, 'A', 1, 6), 'column')
      assert.strictEqual(checkColPlacement(validPuzzleString, 'A', 9, 3), 'column')
      assert.strictEqual(checkColPlacement(validPuzzleString, 'B', 5, 6), 'column')
    })
  })

  suite('checkRegionPlacement()', () => {
    test('valid value in region', () => {
      assert.isUndefined(checkRegionPlacement(validPuzzleString, 'I', 3, 7))
      assert.isUndefined(checkRegionPlacement(validPuzzleString, 'C', 4, 1))
      assert.isUndefined(checkRegionPlacement(validPuzzleString, 'E', 9, 1))
    })

    test('invalid value in region', () => {
      assert.strictEqual(checkRegionPlacement(validPuzzleString, 'B', 8, 2), 'region')
      assert.strictEqual(checkRegionPlacement(validPuzzleString, 'E', 3, 1), 'region')
      assert.strictEqual(checkRegionPlacement(validPuzzleString, 'G', 4, 3), 'region')
    })
  })

  suite('solve()', () => {
    test('valid puzzle pass the solver', () => {
      assert.isString(solver.solve(validPuzzleString))
    })

    test('solve the puzzle', () => {
      const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'

      assert.strictEqual(solver.solve(validPuzzleString), solution)
    })

    test('invalid puzzle', () => {
      const invalidPuzzleString = '..8..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

      assert.deepEqual(solver.solve(invalidPuzzleString), 'Puzzle cannot be solved')
    })
  })
});
