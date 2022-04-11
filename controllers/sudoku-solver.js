class SudokuSolver {

  validate(puzzleString) {
    let error
    if (puzzleString.length !== 81) {
      error = 'Expected puzzle to be 81 characters long'
    }
    if (/[^\d.]/.test(puzzleString)) {
      error = 'Invalid characters in puzzle'
    }

    return error
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const values = []
    const unicodeOfA = 'A'.charCodeAt()
    const rowIndex = (row.charCodeAt() - unicodeOfA) * 9
    const valueIndex = rowIndex + column - 1
    let result

    // Check for filled field
    if (puzzleString[valueIndex] == value) return result

    // Get all numbers in current row
    for (let i = rowIndex; i < rowIndex + 9; i++) {
      if (/\d/.test(puzzleString[i])) {
        values.push(+puzzleString[i])
      }
    }

    // Duplicate found
    if (values.includes(value)) {
      result = 'row'
    }

    return result
  }

  checkColPlacement(puzzleString, row, column, value) {
    const values = []
    const unicodeOfA = 'A'.charCodeAt()
    const valueIndex = (row.charCodeAt() - unicodeOfA) * 9 + column - 1
    let result

    // Check for filled field
    if (puzzleString[valueIndex] == value) return result

    // Get all numbers in current column
    for (let i = column - 1; i < 81; i += 9) {
      if (/\d/.test(puzzleString[i])) {
        values.push(+puzzleString[i])
      }
    }

    // Duplicate found
    if (values.includes(value)) {
      result = 'column'
    }

    return result
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const unicodeOfA = 'A'.charCodeAt()
    const unicodeOfRow = row.charCodeAt()
    const valueIndex = (row.charCodeAt() - unicodeOfA) * 9 + column - 1
    const rowIndex = Math.floor((unicodeOfRow - unicodeOfA) / 3) * 27    // A,B,C = 0 | D,E,F = 27 | G,H,I = 54
    const columnIndex = Math.floor((column - 1) / 3) * 3                 // 1,2,3 = 0 | 4,5,6 = 3  | 7,8,9 = 6
    const regionIndex = rowIndex + columnIndex      // Starting index for each region: 0, 3, 6, 26, 30, 33, 54, 57, 60
    const lastIndex = regionIndex + 21
    const values = []
    let boundary = 0
    let result

    // Check for filled field
    if (puzzleString[valueIndex] == value) return result

    // Get all numbers in current region
    for (let i = regionIndex; i < lastIndex; i++) {
      if (/\d/.test(puzzleString[i])) {
        values.push(+puzzleString[i])
      }
      boundary++

      // Keep track of region boundary
      if (boundary > 2) {
        // right boundary index is 7 less than left boundary
        // index of next line and we subtract 1 from 7 because
        // the loop increment i by one at the beginning of each loop
        i += 6
        boundary = 0
      }
    }

    // Duplicate found
    if (values.includes(value)) {
      result = 'region'
    }

    return result
  }

  solve(puzzleString) {

    const self = this
    let result = 'Invalid puzzle'

    function backtrack(puzzleString, i) {

      function isValid(puzzleString, row, column, value) {
        const validRowPlacement = self.checkRowPlacement(puzzleString, row, column, value)
        const validColPlacement = self.checkColPlacement(puzzleString, row, column, value)
        const validRegionPlacement = self.checkRegionPlacement(puzzleString, row, column, value)

        return !validRowPlacement && !validColPlacement && !validRegionPlacement
      }

      const charCodeOfRow = Math.floor(i / 9) + 65  // unicode of A: 65
      let row = String.fromCharCode(charCodeOfRow)
      let column = i - Math.floor(i / 9) * 9 + 1

      if (i >= puzzleString.length) {
        result = puzzleString
        return
      }

      // Skip prefilled number
      if (/\d/.test(puzzleString[i])) {
        backtrack(puzzleString, i + 1)
      }

      // Try 1 to 9 for each empty field
      for (let n = 1; n <= 9; n++) {
        // Solution found
        if (result !== 'Invalid puzzle') return

        if (isValid(puzzleString, row, column, n)) {
          puzzleString = puzzleString.slice(0, i) + n + puzzleString.slice(i + 1)
          backtrack(puzzleString, i + 1)
        }
      }
    }

    backtrack(puzzleString, 0)
    console.log(result)
    return result
  }
}

module.exports = SudokuSolver;
