/**
 * Modules
 */

var slice = require('sliced')

/**
 * Vars
 */

/**
 * Expose pit
 */

module.exports = pit

/**
 * pit
 */

function pit (p, gen) {
  var args = slice.call(arguments, 2)

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(null, args)
    if (!gen || typeof gen.next !== 'function') return resolve(gen)

    var onFulfilled = iter('next')
    var onRejected = iter('throw')

    onFulfilled()

    function next(ret) {
      if (ret.done) return resolve(ret.value)
      toPromise(ret.value, p).then(filterUndefined(p)).then(onFulfilled, onRejected)
    }

    function iter (attr) {
      return function(res) {
        var ret
        try {
          ret = gen[attr](res)
        } catch (e) {
          return reject(e)
        }
        next(ret)
      }

    }
  })
}

function toPromise (obj, p) {
  if (isPromise(obj)) return obj
  if (isGenerator(obj)) return pit(p, obj)

  return Promise.resolve(obj)

}

function filterUndefined(fn) {
  return function(res) {
    if (!isUndefined(res))
      return fn(res)
    return res
  }
}

function isUndefined (v) {
  return 'undefined' === typeof v
}

function isGenerator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw
}

function isPromise (obj) {
  return obj && 'function' === typeof obj.then
}
