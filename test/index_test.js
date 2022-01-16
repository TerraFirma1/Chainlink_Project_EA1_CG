const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { cgid: 'ethereum', quote: 'USD' } } },
      { name: 'cgid/quote', testData: { id: jobID, data: { cgid: 'ethereum', quote: 'USD' } } },
      { name: 'from/to', testData: { id: jobID, data: { from: 'ethereum', to: 'USD' } } },
      { name: 'coin/market', testData: { id: jobID, data: { coin: 'ethereum', market: 'USD' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'cgid not supplied', testData: { id: jobID, data: { quote: 'USD' } } },
      { name: 'quote not supplied', testData: { id: jobID, data: { cgid: 'ETH' } } },
      { name: 'unknown cgid', testData: { id: jobID, data: { cgid: 'not_real', quote: 'USD' } } },
      { name: 'unknown quote', testData: { id: jobID, data: { cgid: 'ETH', quote: 'not_real' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
