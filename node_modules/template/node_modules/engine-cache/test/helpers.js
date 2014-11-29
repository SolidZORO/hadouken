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


describe('engines helpers', function() {
  beforeEach(function() {
    engines = new Engines();
    engines.setEngine('abc', {render: function () {}});
  });

  describe('.helpers()', function() {
    it('should add a helper to the `cache` for the given engine.', function() {
      var helpers = engines.helpers('abc');
      helpers.addHelper('foo', function() {});
      helpers.getHelper('foo').should.be.a.function;
    });

    it('should get the helpers for the given engine.', function() {
      var helpers = engines.helpers('abc');
      helpers.addHelper('foo', function() {});
      helpers.getHelper().should.be.an.object;
    });

    it('should get the helpers for the given engine.', function() {
      var helpers = engines.helpers('abc');
      assert.equal(typeof helpers, 'object');
    });
  });
});
