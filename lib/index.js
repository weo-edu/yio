'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pit = exports.curry = undefined;

var _genFlatten = require('gen-flatten');

var _genFlatten2 = _interopRequireDefault(_genFlatten);

var _genMapThunk = require('gen-map-thunk');

var _genMapThunk2 = _interopRequireDefault(_genMapThunk);

var _is = require('@weo-edu/is');

var _is2 = _interopRequireDefault(_is);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Curry pit
 * @param  {Thunk} sink Async item processor.
 * @param  {Source} source Source of items to process.
 * @return {Promise}
 */

function curry(sink, source) {
  if (sink && source) return pit(sink, source);
  return function (source) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    pit.apply(undefined, [sink, source].concat(args));
  };
}

/**
 * Pit
 * @param  {Thunk} sink Async item processor.
 * @param  {Source} source Source of items to process.
 * @param  {Array} ...args Initial arguments to source.
 * @return {Promise}
 */

function pit(sink, source) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return _genMapThunk2.default.apply(undefined, [filter(sink), (0, _genFlatten2.default)(source)].concat(args));
}

/**
 * Filter
 * @param  {Thunk} sink
 * @return {Function}
 */

function filter(sink) {
  return function (v) {
    if (_is2.default.promise(v)) {
      return v;
    } else if (_is2.default.array(v)) {
      return v.map(sink);
    } else if (!_is2.default.undefined(v)) {
      return sink(v);
    }
  };
}

exports.default = curry;
exports.curry = curry;
exports.pit = pit;