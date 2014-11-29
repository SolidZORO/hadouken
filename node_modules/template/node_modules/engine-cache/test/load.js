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

describe('engines load', function() {
  /* deps: swig, engine-lodash, handlebars */
  beforeEach(function() {
    engines = new Engines();

    /**
     * Load engine objects from `engines` in node_modules.
     * Engines must be installed individually, just like
     * consolidate.
     */

    engines.load(require('engines'));
  });

  var ctx = {name: 'Jon Schlinkert'};

  describe('.load() render', function() {
    it('should load an object of engines onto the `cache`:', function() {
      engines.getEngine('lodash').should.have.property('render');
      engines.getEngine('handlebars').should.have.property('render');
      engines.getEngine('swig').should.have.property('render');
    });

    it('should render content with a loaded engine: [lodash].', function() {
      var lodash = engines.getEngine('.lodash');
      lodash.renderSync('<%= name %>', ctx).should.equal('Jon Schlinkert');
    });

    it('should render content with a loaded engine: [handlebars].', function() {
      var hbs = engines.getEngine('handlebars');
      hbs.renderSync('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });

    it('should render content with a loaded engine: [swig].', function() {
      var hbs = engines.getEngine('swig');
      hbs.renderSync('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });
  });

  describe('.load() renderSync', function() {
    it('should load an object of engines onto the `cache`:', function() {
      engines.getEngine('lodash').should.have.property('renderSync');
      engines.getEngine('handlebars').should.have.property('renderSync');
      engines.getEngine('swig').should.have.property('renderSync');
    });

    it('should render content with a loaded engine: lodash.', function() {
      var lodash = engines.getEngine('lodash');
      lodash.renderSync('<%= name %>', ctx).should.equal('Jon Schlinkert');
    });

    it('should render content with a loaded engine: handlebars.', function() {
      var hbs = engines.getEngine('handlebars');
      hbs.renderSync('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });

    it('should render content with a loaded engine: swig.', function() {
      var hbs = engines.getEngine('swig');
      hbs.renderSync('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });
  });
});
