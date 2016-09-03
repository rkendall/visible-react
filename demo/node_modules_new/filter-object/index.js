'use strict';

var typeOf = require('kind-of');
var filterKeys = require('filter-keys');
var filterValues = require('filter-values');
var pick = require('object.pick');
var extend = require('extend-shallow');

module.exports = function filterObject(val, patterns, options) {
  if (!val || typeof val !== 'object') {
    throw new Error('filter-object expects an object');
  }

  if (patterns == null) return val;

  if (typeOf(patterns) === 'function') {
    return filterValues(val, patterns, options);
  }

  var keys = filterKeys(val, patterns, options);
  return pick(val, keys);
};
