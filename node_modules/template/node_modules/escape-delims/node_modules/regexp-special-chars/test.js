/*!
 * regexp-special-chars <https://github.com/jonschlinkert/regexp-special-chars>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var re = require('./');

var esc = function (str) {
  return str.replace(new RegExp(re), '\\$&');
};


// test strings borrowed from
// https://github.com/sindresorhus/escape-string-regexp/blob/master/test.js
it('should escape RegExp special characters', function () {
  var escaped = esc('\\ ^ $ * + ? . ( ) | { } [ ]');
  var result = '\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]';
  assert.strictEqual(escaped, result);
});