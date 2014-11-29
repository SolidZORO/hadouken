/*!
 * has-any-deep <https://github.com/jonschlinkert/has-any-deep>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var assert = require('assert');
var hasAnyDeep = require('./');

describe('.hasAnyDeep()', function () {
  it('should check a for a key in nested objects.', function () {
    hasAnyDeep({'foo/bar/baz.md': {}}, ['path']).should.be.false;
    hasAnyDeep({'foo/bar/baz.md': {content: 'this is content'}}, ['path']).should.be.false;
    hasAnyDeep({'foo/bar/baz.md': {path: 'foo/bar/baz.md'}}, ['path']).should.be.true;
    hasAnyDeep({'foo/bar/baz.md': {path: 'foo/bar/baz.md', content: 'This is content'}}, ['path', 'content']).should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, 'a').should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, 'b').should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, 'c').should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, 'd').should.be.false;
    hasAnyDeep({a: {b: {c: 'foo', d: {e: {}}}}}, 'd').should.be.true;
    hasAnyDeep({a: {b: {c: 'foo', d: {e: {}}}}}, 'e').should.be.true;
  });

  it('should check an array of keys against the keys in nested objects.', function () {
    hasAnyDeep({a: {b: {c: 'foo'}}}, ['f', 'a']).should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, ['b']).should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, ['c']).should.be.true;
    hasAnyDeep({a: {b: {c: 'foo'}}}, ['d']).should.be.false;
    hasAnyDeep({a: {b: {c: 'foo', d: {e: {}}}}}, ['d']).should.be.true;
    hasAnyDeep({a: {b: {c: 'foo', d: {e: {}}}}}, ['e']).should.be.true;
  });
});

