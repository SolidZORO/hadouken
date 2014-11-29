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


describe('.renderSync()', function () {
  before(function () {
    engines.init();
    engines.load(require('engines'));
  });

  describe('.getEngine()', function () {
    it('should render content using a cached engine: [handlebars].', function() {
      engines.setEngine('hbs', require('engines').handlebars);
      var hbs = engines.getEngine('hbs');
      var content = hbs.renderSync('a{{letter}}c', {letter: 'b'});
      content.should.equal('abc');
    });
  });

  describe('.load()', function() {
    var ctx = {letter: 'b'};

    it('should load the cache with engines.', function() {
      engines.getEngine('lodash').should.have.property('renderSync');
      engines.getEngine('underscore').should.have.property('renderSync');
      engines.getEngine('handlebars').should.have.property('renderSync');
      engines.getEngine('swig').should.have.property('renderSync');
    });

    it('should render content with a loaded engine: lodash.', function() {
      var lodash = engines.getEngine('lodash');
      lodash.renderSync('a<%= letter %>c', ctx).should.equal('abc');
    });

    it('should render content with a loaded engine: handlebars.', function() {
      var hbs = engines.getEngine('handlebars');
      hbs.renderSync('a{{ letter }}c', ctx).should.equal('abc');
    });

    it('should render content with a loaded engine: swig.', function() {
      var hbs = engines.getEngine('swig');
      hbs.renderSync('a{{ letter }}c', ctx).should.equal('abc');
    });
  });
});