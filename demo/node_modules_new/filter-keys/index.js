'use strict';

var mm = require('micromatch');

module.exports = function filterKeys(o, patterns, options) {
  if (o == null) {
    throw new Error('filter-keys expects an object');
  }

  var keys = Object.keys(o);
  if (!patterns || arguments.length === 1) {
    return keys;
  }

  return mm(keys, patterns, options);
};
