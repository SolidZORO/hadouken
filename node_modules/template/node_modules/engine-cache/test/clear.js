/*!
 * engine-cache <https://github.com/jonschlinkert/engine-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Engines = require('..');
var engines = new Engines();


describe('engines clear', function() {
  beforeEach(function() {
    engines.clear();
  });

  describe('.clear()', function() {
    it('should clear an engine from the `cache`.', function() {
      engines.setEngine('a', {render: function () {} });
      engines.setEngine('b', {render: function () {} });
      engines.setEngine('c', {render: function () {} });
      engines.setEngine('d', {render: function () {} });

      engines.cache.should.have.property('.a');
      engines.cache.should.have.property('.b');
      engines.cache.should.have.property('.c');
      engines.cache.should.have.property('.d');

      Object.keys(engines.cache).length.should.equal(4);

      engines.clear('a');
      engines.cache.should.not.have.property('.a');
      engines.cache.should.have.property('.b');

      Object.keys(engines.cache).length.should.equal(3);

      engines.clear('b');
      engines.cache.should.not.have.property('.a');
      engines.cache.should.not.have.property('.b');

      Object.keys(engines.cache).length.should.equal(2);
    });
  });
});
