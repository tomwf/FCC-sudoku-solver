const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('/api/solve', () => {
    test('missing puzzle in POST request returns an error', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Required field missing' })
          done()
        })
    })

    test('invalid characters in puzzle', (done) => {
      const puzzle = 'invalidcharactersinpuzzle'

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
          done()
        })
    })

    test('puzzle is not 81 characters long', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
          done()
        })
    })

    test('puzzle cannot be solved', (done) => {
      const puzzle = '..2..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
          done()
        })
    })
  })

  suite('/api/check', () => {
    test('POST request with valid value at given coordinate', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'A1'
      const value = 7
      const req = {
        puzzle,
        coordinate,
        value
      }
      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          const body = res.body

          assert.isObject(body)
          assert.property(body, 'valid')
          assert.isBoolean(body.valid)
          assert.isTrue(body.valid)
          done()
        })
    })

    test('POST request with invalid value at given coordinate', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'D7'
      const value = 6
      const req = {
        puzzle,
        coordinate,
        value
      }
      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          const body = res.body

          assert.isObject(body)
          assert.property(body, 'valid')
          assert.isBoolean(body.valid)
          assert.isFalse(body.valid)
          assert.property(body, 'conflict')
          assert.isArray(body.conflict)
          assert.include(body.conflict, 'row')
          assert.include(body.conflict, 'column')
          assert.include(body.conflict, 'region')
          done()
        })
    })

    test('invalid characters in puzzle', (done) => {
      const puzzle = 'invalidcharactersinpuzzle'
      const coordinate = 'D7'
      const value = 6
      const req = {
        puzzle,
        coordinate,
        value
      }

      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          const body = res.body
          assert.deepEqual(body, { error: 'Invalid characters in puzzle' })
          done()
        })
    })

    test('puzzle is not 81 characters', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'
      const coordinate = 'D7'
      const value = 6
      const req = {
        puzzle,
        coordinate,
        value
      }

      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
          done()
        })
    })

    suite('missing required field(s)', () => {
      test('missing puzzle', (done) => {
        const coordinate = 'D7'
        const value = 6
        const req = {
          coordinate,
          value
        }

        chai.request(server)
          .post('/api/check')
          .send(req)
          .end((err, res) => {
            if (err) console.error(err)

            assert.deepEqual(res.body, { error: 'Required field(s) missing' })
            done()
          })
      })

      test('missing coordinate', (done) => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = 6
        const req = {
          puzzle,
          value
        }

        chai.request(server)
          .post('/api/check')
          .send(req)
          .end((err, res) => {
            if (err) console.error(err)

            assert.deepEqual(res.body, { error: 'Required field(s) missing' })
            done()
          })
      })

      test('missing value', (done) => {
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const coordinate = 'D7'
        const req = {
          puzzle,
          coordinate,
        }

        chai.request(server)
          .post('/api/check')
          .send(req)
          .end((err, res) => {
            if (err) console.error(err)

            assert.deepEqual(res.body, { error: 'Required field(s) missing' })
            done()
          })
      })

      test('missing every field', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({})
          .end((err, res) => {
            if (err) console.error(err)

            assert.deepEqual(res.body, { error: 'Required field(s) missing' })
            done()
          })
      })
    })

    test('value not between 1 and 9', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'D7'
      const value = 10
      const req = {
        puzzle,
        coordinate,
        value
      }

      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Invalid value' })
          done()
        })
    })

    test('invalid coordinate', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'J0'
      const value = 9
      const req = {
        puzzle,
        coordinate,
        value
      }

      chai.request(server)
        .post('/api/check')
        .send(req)
        .end((err, res) => {
          if (err) console.error(err)

          assert.deepEqual(res.body, { error: 'Invalid coordinate' })
          done()
        })
    })
  })
});

