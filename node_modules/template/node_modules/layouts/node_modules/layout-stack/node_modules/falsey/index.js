/*!
 * falsey <https://github.com/jonschlinkert/falsey>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

function typeOf(val) {
  return toString.call(val)
    .toLowerCase()
    .replace(/\[object ([\w]+)\]/, '$1');
}

function isArguments(obj) {
  return obj
    && (typeof obj === 'object')
    && (typeof obj.length === 'number')
    && (typeOf(obj) === 'arguments') || false;
}

/**
 * ## falsey
 *
 * Return `true` if value is falsey.
 *
 * @param  {*} `value` Any type of value.
 * @param  {Array} `arr` Array of keywords to evaluate as falsey.
 * @return {Boolean}
 */

module.exports = function(value, arr) {
  // override these by passing an array as a second param
  var falsey = ['false', 'none', 'nil', 'null'];

  if (isArguments(value)) {
    return !Boolean(Object.keys(value).length);
  }
  if (typeOf(value) === 'object') {
    return !Boolean(Object.keys(value).length);
  }
  if (Array.isArray(value)) {
    return !Boolean(value.length);
  }
  return !Boolean(value) || (arr || falsey).indexOf(value) !== -1;
};
