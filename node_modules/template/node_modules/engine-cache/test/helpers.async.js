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
var consolidate = require('consolidate');

describe('async helpers', function () {
  before(function () {
    engines = new Engines();
  });

  it('should render content with handlebars.', function(done) {
    engines.setEngine('hbs', consolidate.handlebars);
    var helpers = engines.helpers('hbs');
    helpers.addAsyncHelper('upper', function (str, options, callback) {
      callback(null, str.toUpperCase());
    });

    var hbs = engines.getEngine('hbs');
    hbs.render('{{upper name}}', {name: 'Jon Schlinkert'}, function (err, content) {
      if (err) console.log(err);
      content.should.equal('JON SCHLINKERT');
      done();
    });
  });

  it('should render content with handlebars.', function(done) {
    engines.setEngine('hbs', consolidate.handlebars);
    var helpers = engines.helpers('hbs');
    helpers.addAsyncHelper('upper', function (str, options, callback) {
      callback(null, str.toUpperCase());
    });

    var hbs = engines.getEngine('hbs');
    var ctx = {jon: 'Jon Schlinkert', brian: 'Brian Woodward'};

    hbs.render('Jon: {{upper jon}}\nBrian: {{upper brian}}', ctx, function (err, content) {
      if (err) console.log(err);
      content.should.equal('Jon: JON SCHLINKERT\nBrian: BRIAN WOODWARD');
      done();
    });
  });
});