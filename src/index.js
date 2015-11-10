import flatten from 'gen-flatten'
import map from 'gen-map-thunk'
import is from '@weo-edu/is'
import assert from 'assert'


/**
 * Curry yio
 * @param  {Thunk} io Async item controlor.
 * @param  {Generator} control control of items to control.
 * @return {Function|Promise}
 */

function curry (io, control) {
  assert(is.function(io), 'First argument to curry must be a function.')
  if (io && control) return yio(io, control)
  return function curriedYio (control, ...args) {
    return yio(io, control, ...args)
  }
}

/**
 * Wrap yio in function
 * @param  {Thunk} io
 * @param  {Generator} control
 * @return {Function}
 */

function wrap (io, control) {
  assert(is.function(io), 'First argument to wrap must be a function.')

  if (io && control) {
    return function (...args) {
      return yio(io, control, ...args)
    }
  }

  if (io.name === 'curriedYio') {
    return function (control) {
      return function (...args) {
        return io(control, ...args)
      }
    }
  }

  return function (control) {
    return function (...args) {
      return yio(io, control, ...args)
    }
  }
}

/**
 * yio
 * @param  {Thunk} io Async item controlor.
 * @param  {Generator} control control of items to control.
 * @param  {Array} ...args Initial arguments to control.
 * @return {Promise}
 */

function yio(io, control, ...args) {
  return map(filter(io), flatten(control), ...args)
}

/**
 * Filter
 * @param  {Thunk} io
 * @return {Function}
 */

function filter (io) {
  return function (action) {
    if (is.undefined(action) || is.promise(action)) {
      return action
    } else if (is.function(action.map)) {
      return action.map(io)
    } else {
      return io(action)
    }
  }
}

export default curry
export {
  yio,
  wrap,
  curry
}
