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
var engine = require('engine-handlebars');


describe('engines compile', function () {
  before(function () {
    engines = new Engines();
  });

  describe('.compile()', function () {
    it('should compile content with a cached engine: [handlebars].', function(done) {
      engines.setEngine('hbs', engine);
      var hbs = engines.getEngine('hbs');

      var settings = {
        partials: {
          'a': 'This is A: {{upper partials.a}} - {{lower helpers.a}}',
          'b': 'This is B: {{upper partials.b}} - {{lower helpers.b}}',
          'c': 'This is C: {{upper partials.c}} - {{lower helpers.c}}'
        },
        helpers: {
          'upper': function (str) { return str.toUpperCase(); },
          'lower': function (str) { return str.toLowerCase(); }
        }
      };

      var template = [
        '{{> a }}',
        '{{> b }}',
        '{{> c }}'
      ].join('\n\n');

      var context = {
        partials: {
          a: 'Partials Context A',
          b: 'Partials Context B',
          c: 'Partials Context C'
        },
        helpers: {
          a: 'Helpers Context A',
          b: 'Helpers Context B',
          c: 'Helpers Context C'
        }
      };

      var expected = [
        'This is A: PARTIALS CONTEXT A - helpers context a',
        'This is B: PARTIALS CONTEXT B - helpers context b',
        'This is C: PARTIALS CONTEXT C - helpers context c'
      ].join('\n');

      var fn = hbs.compile(template, settings);
      hbs.render(fn, context, function (err, content) {
        content.should.equal(expected);
        done();
      });
    });
  });
});