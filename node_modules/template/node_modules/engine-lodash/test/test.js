/*!
 * engine-lodash <https://github.com/jonschlinkert/engine-lodash>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var lodash = require('..');


describe('.renderSync()', function () {
  it('should render templates.', function () {
    var str = lodash.renderSync('Jon <%= name %>', {name: 'Schlinkert'});
    str.should.equal('Jon Schlinkert');
  });

  it('should use custom delimiters.', function () {
    var str = lodash.renderSync('Jon <%= name %> {%= name %}', {
      delims: ['{%', '%}'],
      name: 'Schlinkert'
    });
    str.should.equal('Jon <%= name %> Schlinkert');
  });
});


describe('.render()', function() {
  it('should render templates.', function(done) {
    var ctx = {name: 'Jon Schlinkert'};

    lodash.render('<%= name %>', ctx, function (err, content) {
      content.should.equal('Jon Schlinkert');
      done();
    });
  });

  it('should use custom delimiters: swig.', function(done) {
    var ctx = {name: 'Jon Schlinkert', delims: ['{%', '%}']};

    lodash.render('{%= name %}', ctx, function (err, content) {
      content.should.equal('Jon Schlinkert');
      done();
    });
  });

  it('should use custom delimiters: hbs.', function(done) {
    var ctx = {name: 'Jon Schlinkert', delims: ['{{', '}}']};

    lodash.render('{{= name }}', ctx, function (err, content) {
      content.should.equal('Jon Schlinkert');
      done();
    });
  });

  it('should use helpers registered on the imports property.', function(done) {
    var ctx = {
      name: 'Jon Schlinkert',
      imports: {
        include: function(name) {
          var filepath = path.join('test/fixtures', name);
          return fs.readFileSync(filepath, 'utf8');
        },
        upper: function(str) {
          return str.toUpperCase();
        }
      }
    };

    lodash.render('<%= upper(include("content.tmpl")) %>', ctx, function (err, content) {
      content.should.equal('JON SCHLINKERT');
      done();
    });
  });
});


describe('.renderFile()', function() {
  it('should render templates from a file.', function(done) {
    var ctx = {name: 'Jon Schlinkert'};

    lodash.renderFile('test/fixtures/default.tmpl', ctx, function (err, content) {
      content.should.equal('Jon Schlinkert');
      done();
    });
  });
});

