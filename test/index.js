var pit = require('..')
var assert = require('assert')

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
      assert.deepEqual(l, [[11, 12, 13], 21, 22, 23, 3])
      done()
    })

  })

  it('should iterate over generator like fns', function (done) {
    var g = gen(function() {
      return [11, 12, 13]
    })
    .yield(twos)
    .yield(function() {
      return 3
    })

    pit(log, g).then(function() {
      assert.deepEqual(l, [[11, 12, 13], 21, 22, 23, 3])
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

  function *twos() {
    yield 21
    yield 22
    yield 23
  }

  function log (val) {
    l.push(val)
  }
})


function gen(fn) {
  var arr = [fn]

  function it() {
    var idx = 0
    return {
      next: function (res) {
        return idx < arr.length
          ? {value: arr[idx++](res), done: false}
          : {done: true}
      }
    }
  }

  it.yield = function (fn) {
    arr.push(fn)
    return it
  }

  return it
}
