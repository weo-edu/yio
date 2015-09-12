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

function pit (p, it) {
  if (p && it) return run(p, it)
  else return function(it) {
    return run(p, it)
  }
}


/**
 * pit
 */

function run (p, it) {
  return new Promise(function(resolve, reject) {
    if (typeof it === 'function') it = it()
    if (!it || typeof it.next !== 'function') return pitted(it).then(resolve, reject)

    var onFulfilled = iter('next')
    var onRejected = iter('throw')

    onFulfilled()

    function next (ret) {
      if (ret.done) return resolve(ret.value)
      pitted(ret.value).then(onFulfilled, onRejected)
    }

    function pitted (value) {
      return toPromise(value, p).then(filterUndefined(p))
    }

    function iter (attr) {
      return function(res) {
        var ret
        try {
          ret = it[attr](res)
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
  if (isiterator(obj)) return pit(p, obj)

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

function isiterator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw
}

function isPromise (obj) {
  return obj && 'function' === typeof obj.then
}
