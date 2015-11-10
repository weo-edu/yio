import {yio, curry, wrap} from '../src'
import test from 'tape'


let l
function before () {
  l = []
}

test('should push respones', (t) => {
  yio(addOne, function * () {
    var res = yield 1
    res = yield res
    t.equal(res, 3)
  }).then(function() {
    t.end()
  })

  function addOne(x) {
    return x + 1
  }
})

test('should push async responses', (t) => {
  yio(addOne, function * () {
    var res = yield 1
    res = yield res
    t.equal(res, 3)
  }).then(function() {
    t.end()
  })

  function addOne(x) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(x + 1)
      })
    })
  }
})

test('should flatten nested generators', (t) => {
  before()
  yio(log, function * () {
    var res = yield [11, 12, 13]
    yield twos()
    yield 3
  }).then(function() {
    t.deepEqual(l, [11, 12, 13, 21, 22, 23, 3])
    t.end()
  })
})

test('should map nested return value', (t) => {
  before()
  yio(log, function * () {
    yield 1
    yield ones()
  }).then(function () {
    t.deepEqual(l, [1, 11, 12])
    t.end()
  })
})

test('should map yielded array in parallel', (t) => {
  yio(addOne, function * () {
    var res = yield [1, 2, 3]
    res = yield res
    t.deepEqual(res, [3, 4, 5])
  }).then(function() {
    t.end()
  })

  function addOne(x) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(x + 1)
      })
    })
  }
})

test('should not map yielded promises', (t) => {
  let mapped = false
  yio(function () {
    mapped = true
  }, function * () {
    return yield Promise.resolve(1)
  }).then(function (v) {
    t.equal(v, 1)
    t.ok(!mapped)
    t.end()
  })
})

test('should not map yielded undefined', (t) => {
  let mapped = false
  yio(function () {
    mapped = true
  }, function * () {
    return yield
  }).then(function (v) {
    t.equal(v, undefined)
    t.ok(!mapped)
    t.end()
  })
})

test('should curry', (t) => {
  before()
  curry(log)(function * () {
    var res = yield [11, 12, 13]
    yield twos()
    yield 3
  }).then(function() {
    t.deepEqual(l, [11, 12, 13, 21, 22, 23, 3])
    t.end()
  })
})

test('should wrap', (t) => {
  before()
  wrap(log, function * (input) {
    yield input
  })(1).then(function () {
    t.deepEqual(l, [1])
    t.end()
  })
})

test('should wrap curry', (t) => {
  before()
  let c = curry(log)
  wrap(c)(function * (input) {
    yield input
  })(1).then(function () {
    t.deepEqual(l, [1])
    t.end()
  })
})

test('should curry wrap', (t) => {
  before()
  wrap(log)(function * (input) {
    yield input
  })(1).then(function () {
    t.deepEqual(l, [1])
    t.end()
  })
})


function * ones() {
  yield 11
  return 12
}

function * twos() {
  yield 21
  yield 22
  yield 23
}

function log (val) {
  l.push(val)
}
