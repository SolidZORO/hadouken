/*!
 * engine-cache <https://github.com/jonschlinkert/engine-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Engines = require('..');
var engines;

describe('engines init', function() {
  beforeEach(function() {
    engines = new Engines();
  });

  it('engines.cache should be an empty object.', function() {
    engines.init();
    engines.cache.should.be.an.object;
    Object.keys(engines.cache).length.should.equal(0);
  });
});
