/*!
 * has-any <https://github.com/jonschlinkert/has-any>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var hasAny = require('./');

describe('.hasAny()', function () {
  it('should return `true` when the specified nested property exists.', function () {
    hasAny({a: {b: {c: 'foo'}}}, ['a', 'g']).should.be.true;
    hasAny({a: {b: {c: 'foo'}}, bar: true}, ['foo', 'bar']).should.be.true;
  });

  it('should return `false` when the specified nested property does not exist.', function () {
    hasAny({a: {b: {c: 'foo'}}}, ['b']).should.be.false;
    hasAny({a: {b: {c: 'foo'}}}, ['c']).should.be.false;
    hasAny({a: {b: {c: 'foo'}}}, ['d']).should.be.false;
  });
});