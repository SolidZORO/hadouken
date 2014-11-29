/*!
 * engine-cache <https://github.com/jonschlinkert/engine-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Engines = require('..');
var engines;

describe('engines setEngine', function() {
  beforeEach(function() {
    engines = new Engines();
  });

  describe('.setEngine()', function() {
    it('should set engines on the `engines` object.', function() {
      engines.setEngine('a', {render: function () {} });
      engines.setEngine('b', {render: function () {} });
      engines.setEngine('c', {render: function () {} });
      engines.setEngine('d', {render: function () {} });

      engines.cache.should.have.properties('.a', '.b', '.c', '.d');
    });

    it('should normalize engine extensions to have a dot.', function() {
      engines.setEngine('a', {render: function () {} });
      engines.setEngine('b', {render: function () {} });
      engines.setEngine('c', {render: function () {} });
      engines.setEngine('d', {render: function () {} });

      engines.cache.should.have.properties('.a', '.b', '.c', '.d');
    });

    it('should be chainable.', function() {
      engines
        .setEngine('a', {render: function () {} })
        .setEngine('b', {render: function () {} })
        .setEngine('c', {render: function () {} })
        .setEngine('d', {render: function () {} });

      engines.cache.should.have.properties('.a', '.b', '.c', '.d');
    });

    it('should allow options to be passed as the last argument.', function() {
      engines.setEngine('a', {render: function () {}}, {foo: 'bar'})
      engines.getEngine('.a').options.foo.should.be.a.string;
    });

    it('should allow options to be passed as the second argument.', function() {
      engines.setEngine('a', {foo: 'bar'}, {render: function () {}})
      engines.getEngine('.a').options.foo.should.be.a.string;
    });
  });
});
