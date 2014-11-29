/*!
 * engine-cache <https://github.com/jonschlinkert/engine-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var lodash = require('engine-lodash');
var Engines = require('..');
var engines = new Engines();

describe('engines', function() {
  after(function() {
    engines.clear();
  });

  describe('.getEngine()', function() {
    it('should cache the lodash engine.', function() {
      var ctx = {name: 'Jon Schlinkert'};
      engines.setEngine('tmpl', lodash);
      engines.getEngine('tmpl').should.have.property('render');
    });

    it('should render content with a loaded engine: lodash.', function(done) {
      var lodash = require('engine-lodash');
      var ctx = {name: 'Jon Schlinkert'};
      engines.setEngine('tmpl', lodash);

      var lodash = engines.getEngine('tmpl');
      lodash.render('<%= name %>', ctx, function (err, content) {
        content.should.equal('Jon Schlinkert');
        done();
      });
    });
  });
});
