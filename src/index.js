import flatten from 'gen-flatten'
import map from 'gen-map-thunk'
import is from '@weo-edu/is'


/**
 * Curry pit
 * @param  {Thunk} sink Async item processor.
 * @param  {Source} source Source of items to process.
 * @return {Promise}
 */

function curry (sink, source) {
  if (sink && source) return pit(sink, source)
  return function (source, ...args) {
    pit(sink, source, ...args)
  }
}

/**
 * Pit
 * @param  {Thunk} sink Async item processor.
 * @param  {Source} source Source of items to process.
 * @param  {Array} ...args Initial arguments to source.
 * @return {Promise}
 */

function pit(sink, source, ...args) {
  return map(filter(sink), flatten(source), ...args)
}

/**
 * Filter
 * @param  {Thunk} sink
 * @return {Function}
 */

function filter (sink) {
  return function (v) {
    if (is.promise(v)) {
      return v
    } else if (is.array(v)) {
      return v.map(sink)
    } else if (!is.undefined(v)) {
      return sink(v)
    }
  }
}

export default curry
export {
  curry,
  pit
}
