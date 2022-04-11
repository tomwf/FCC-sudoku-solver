'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

module.exports = function (app) {

  app.route('/api/check')
    .post((req, res) => {
      let {
        puzzle,
        coordinate,
        value
      } = req.body
      const row = coordinate[0].toUpperCase()
      const column = +coordinate[1]
      value = +value

      console.log({puzzle, coordinate, row, column, value})

      // Check for invalid puzzle string
      if (solver.validate(puzzle)) return res.json({ error: solver.validate(puzzle) })

      // Check for valid value
      if (value < 1 || value > 9) return res.json({ error: 'Invalid value' })

      // Check for invalid coordinate
      if (
        row.charCodeAt() < 65 || row.charCodeAt() > 73
        || column < 1 || column > 9
        || coordinate.length !== 2
      ) return res.json({ error: 'Invalid coordinate'})

      const message = { valid: true }
      const conflict = []
      const invalidRow = solver.checkRowPlacement(puzzle, row, column, value)
      const invalidCol = solver.checkColPlacement(puzzle, row, column, value)
      const invalidRegion = solver.checkRegionPlacement(puzzle, row, column, value)

      console.log({invalidRow, invalidCol, invalidRegion})
      if (invalidRow) conflict.push(invalidRow)
      if (invalidCol) conflict.push(invalidCol)
      if (invalidRegion) conflict.push(invalidRegion)
      if (conflict.length > 0) message['conflict'] = conflict

      res.json(message)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body
      const solution = solver.solve(puzzle)

      if (solution.length === 81) {
        res.send({ solution })
      } else {
        res.send()
      }
    });
};
