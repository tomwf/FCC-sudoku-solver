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

      // Check for missing field(s)
      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' })

      const row = coordinate[0].toUpperCase()
      const column = +coordinate[1]
      value = +value

      console.log({puzzle, coordinate, row, column, value})

      // Check for invalid puzzle string
      if (solver.validate(puzzle)) return res.json({ error: solver.validate(puzzle) })

      // Check for valid value
      if (/[^1-9]/.test(value)) return res.json({ error: 'Invalid value' })

      // Check for invalid coordinate
      if (/(^[^A-I][^1-9]$)||(^[A-I][^1-9]$)||(^[^A-I][1-9]$)/.test(coordinate)) return res.json({ error: 'Invalid coordinate'})

      const message = { valid: false }
      const conflict = []
      const invalidRow = solver.checkRowPlacement(puzzle, row, column, value)
      const invalidCol = solver.checkColPlacement(puzzle, row, column, value)
      const invalidRegion = solver.checkRegionPlacement(puzzle, row, column, value)

      console.log({invalidRow, invalidCol, invalidRegion})
      if (invalidRow) conflict.push(invalidRow)
      if (invalidCol) conflict.push(invalidCol)
      if (invalidRegion) conflict.push(invalidRegion)
      if (conflict.length > 0) {
        message['conflict'] = conflict
      } else {
        message.valid = true
      }

      res.json(message)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body

      if (!puzzle) return res.send({ error: 'Required field missing' })

      if (/[^\d.]/.test(puzzle)) return res.send({ error: 'Invalid characters in puzzle' })
      const solution = solver.solve(puzzle)

      if (solution.length === 81) {
        res.send({ solution })
      } else {
        res.send()
      }
    });
};
