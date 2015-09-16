/**
 * Modules
 */

var slice = require('sliced')
var is = require('@weo-edu/is')

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
    if (is.function(it)) it = it()
    if (!it || !is.generator(it)) return pitted(it).then(resolve, reject)

    var onFulfilled = iter('next')
    var onRejected = iter('throw')

    onFulfilled()

    function next (ret) {
      if (ret.done) return resolve(ret.value)
      pitted(ret.value).then(onFulfilled, onRejected)
    }

    function pitted (value) {
      return toPromise(value, p).then(filterUndefined(maybeMap(p)))
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
  if (is.promise(obj)) return obj
  if (is.generator(obj)) return pit(p, obj)
  if (is.array(obj)) return Promise.all(obj)
  return Promise.resolve(obj)
}

function maybeMap (fn) {
  return function (res) {
    if (is.array(res)) {
      return Promise.all(res.map(function (r) {
        return fn(r)
      }))
    } else {
      return fn(res)
    }
  }
}

function filterUndefined(fn) {
  return function(res) {
    if (!is.undefined(res))
      return fn(res)
    return res
  }
}
