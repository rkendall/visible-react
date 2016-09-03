/*!
 * is-match <https://github.com/jonschlinkert/is-match>
 *
 * Copyright (c) 2015-2016 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var deepEqual = require('deep-equal');
var isObject = require('is-extendable');
var isGlob = require('is-glob');
var mm = require('micromatch');

function isMatch(pattern, options) {
  options = options || {};

  if (typeof pattern === 'function') {
    return pattern;
  }

  if (pattern instanceof RegExp) {
    return function(val) {
      return pattern.test(val);
    };
  }

  if (typeof pattern === 'string') {
    if (isGlob(pattern)) {
      return function(val) {
        return mm(val, pattern, options).length !== 0;
      };
    }
    return function(val) {
      if (options.strict === true) {
        return pattern === val;
      }
      return val.indexOf(pattern) > -1;
    };
  }

  if (Array.isArray(pattern)) {
    return function(val) {
      return mm(val, pattern, options).length !== 0;
    };
  }

  if (isObject(pattern)) {
    return function(val) {
      return deepEqual(val, pattern);
    };
  }

  throw new TypeError('isMatch expects a string, array, regex, plain object or function:', arguments);
}

/**
 * Expose `isMatch`
 */

module.exports = isMatch;
