/*!
 * filter-values <https://github.com/jonschlinkert/filter-values>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var forOwn = require('for-own');
var matcher = require('is-match');

/**
 * Filter an object values using glob patterns
 * or with a `callback` function returns true.
 *
 * @param  {Object} `obj`
 * @param  {Function|Array|String|RegExp} `filter`
 * @param  {Object} `options` pass options to `micromatch`
 * @return {Object}
 */

module.exports = function filterValues(obj, filter, options) {
  var isMatch = matcher(filter, options);
  var res = {};

  forOwn(obj, function (val, key) {
    if (isMatch(val)) {
      res[key] = val;
    }
  });
  return res;
};
