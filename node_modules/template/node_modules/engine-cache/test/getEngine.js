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


describe('engines getEngine', function() {
  beforeEach(function() {
    engines = new Engines();
  });

  describe('.getEngine()', function() {
    it('should getEngine the given engine from the `cache`.', function() {
      engines.setEngine('a', {render: function () {} });
      engines.setEngine('b', {render: function () {} });
      engines.setEngine('c', {render: function () {} });
      engines.setEngine('d', {render: function () {} });

      engines.getEngine('a').should.have.property('render');
      engines.getEngine('b').should.have.property('render');
      engines.getEngine('c').should.have.property('render');
      engines.getEngine('d').should.have.property('render');
    });
  });
});
