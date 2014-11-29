/**
 * escape-delims <https://github.com/assemble/escape-delims>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var escapeRe = require('regexp-special-chars');
var Delims = require('delims');
var delims = new Delims();


/**
 * Create a new instance of `EscapeDelims()`:
 *
 * ```js
 * var EscapeDelims = require('escape-delims');
 * var escapeDelims = new EscapeDelims();
 * ```
 *
 * Optionally pass the "escape delimiters" to use as an array:
 *
 * ```js
 * var escapeDelims = new EscapeDelims(['<%%', '%>']);
 * ```
 *
 * @param {Array} `from` Optionally pass delimiters to use for escaping. Defaults to `['{%%', '%}']`.
 * @param {Array} `to` Optionally pass delimiters to use for un-escaping. Defaults to `['{%%', '%}']`.
 * @api public
 */

function EscapeDelims(from, to) {
  this.from = from || ['{%%', '%}'];
  this.to = to || this.from;

  // private properties but can be changed if necessary
  this.a = '(;^__^;)';
  this.b = '(;^_^;)';
}

/**
 * Escape the given `str`, optionally passing a delimiter `syntax`
 * to use if not defined in the constructor.
 *
 * **Example:**
 *
 * ```js
 * escapeDelims.escape('<%%= first %><%= last %>', ['<%%', '%>']);
 * //=> '(;^__^;) first (;\^_\^;)<%= last %>'
 * ```
 *
 * @param  {String} `str` The string with delimiters to escape.
 * @param  {Array} `from` The delimiter syntax to use.
 * @api public
 */

EscapeDelims.prototype.escape = function(str, from) {
  var re = delims.templates(from || this.from).evaluate;
  return str.replace(re, this.a + '$1' + this.b);
};

/**
 * Un-escape previously escaped delimiters in the given `str`. Optionally
 * pass the `syntax` to use if they have not already been defined.
 *
 * **Example:**
 *
 * ```js
 * escapeDelims.unescape('(;^__^;) first (;\^_\^;)<%= last %>', ['<%%', '%>']);
 * //=> '<%= first %><%= last %>'
 * ```
 *
 * @param  {String} `str` The string with delimiters that need to be escaped.
 * @param  {Array} `to` The delimiter syntax to use for un-escaping.
 * @api public
 */

EscapeDelims.prototype.unescape = function(str, to) {
  var d = to || this.to;
  return str
    .replace(makeRe(this.a), d[0])
    .replace(makeRe(this.b), d[1]);
};


function makeRe(str) {
  str = str.replace(escapeRe, '\\$&');
  return new RegExp(str, 'g');
}

module.exports = EscapeDelims;