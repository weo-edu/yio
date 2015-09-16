var pit = require('..')
var assert = require('assert')
var yields = require('@weo-edu/yields')

describe('pit', function () {
  var l
  beforeEach(function () {
    l = []
  })

  it('should iterate over es6 generators', function (done) {

    pit(log, function *() {
      var res = yield [11, 12, 13]
      yield twos()
      yield 3
    }).then(function() {
      assert.deepEqual(l, [11, 12, 13, 21, 22, 23, 3])
      done()
    })
  })

  it('should not pit top level return value', function (done) {
    pit(log, function *() {
      yield 1
      yield 2
      return 3
    }).then(function(val) {
      assert.equal(val, 3)
      assert.deepEqual(l, [1, 2])
      done()
    })
  })

  it('should pit nested return value', function (done) {
    pit(log, function *() {
      yield 1
      yield ones()
    }).then(function () {
      assert.deepEqual(l, [1, 11, 12])
      done()
    })
  })

  it('should throw errors in pit', function (done) {
    pit(function (val) {
      throw val
    }, function *() {
      try {
        yield 1
      } catch (e) {
        return 1
      }
    }).then(function(val) {
      assert.equal(val, 1)
      done()
    })
  })

  it('should throw rejected promises in pit', function(done) {
    pit(function (val) {
      return Promise.reject(val)
    }, function *() {
      try {
        yield 1
      } catch (e) {
        return 1
      }
    }).then(function(val) {
      assert.equal(val, 1)
      done()
    })
  })

  it('should throw reject erros thrown in iterator', function (done) {
    pit(log, function * () {
      throw new Error('foo')
    }).catch(function(err) {
      assert(err)
      done()
    })
  })


  it('should push respones', function (done) {
    pit(addOne, function *(){
      var res = yield 1
      res = yield res
      assert.equal(res, 3)
    }).then(function() {
      done()
    })

    function addOne(x) {
      return x + 1
    }

  })

  it('should push async responses', function (done) {
    pit(addOne, function *(){
      var res = yield 1
      res = yield res
      assert.equal(res, 3)
    }).then(function() {
      done()
    })

    function addOne(x) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(x + 1)
        })
      })
    }
  })

  it('should push run array yields in parallel', function (done) {
    pit(addOne, function *(){
      var res = yield [1, 2, 3]
      res = yield res
      assert.deepEqual(res, [3, 4, 5])
    }).then(function() {
      done()
    })

    function addOne(x) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(x + 1)
        })
      })
    }
  })

  it('should curry', function (done) {
    pit(log)(function *() {
      var res = yield [11, 12, 13]
      yield twos()
      yield 3
    }).then(function() {
      assert.deepEqual(l, [11, 12, 13, 21, 22, 23, 3])
      done()
    })
  })

  it('should iterate over generator like fns', function (done) {
    var g = yields(
      function() {
        return [11, 12, 13]
      },
      twos,
      function() {
        return 3
    })

    pit(log, g).then(function() {
      assert.deepEqual(l, [11, 12, 13, 21, 22, 23, 3])
      done()
    }).catch(function(err) {console.log(err.stack)})

  })

  function *ones() {
    yield 11
    return 12
  }

  function *twos() {
    yield 21
    yield 22
    yield 23
  }

  function log (val) {
    l.push(val)
  }
})
