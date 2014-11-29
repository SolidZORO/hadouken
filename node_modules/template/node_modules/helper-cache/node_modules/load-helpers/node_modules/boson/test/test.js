/*!
 * boson <https://github.com/jonschlinkert/boson>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

var path = require('path');
var expect = require('chai').expect;
var boson = require('../');


// Ensure that patterns start from cwd;
var fixtures = function(patterns) {
  return path.join(process.cwd(), 'test/fixtures/', patterns);
};


describe('boson.find():', function () {
  describe('when a node module is defined:', function () {
    it('should return an array of all of the modules found', function () {
      var actual = boson.find('chai');
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(1);
    });

    it('should return an array of all of the modules found', function () {
      var actual = boson.find('mocha');
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(1);
    });

    it('should return an array of all of the modules found', function () {
      var actual = boson.find('node-foo');
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(1);
    });
  });

  describe('when a both node modules and local files are defined:', function () {
    it('should return an array of all of the modules found', function () {
      var actual = boson.find(['node-*', fixtures('*.js')]);
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(8);
    });
  });
});


describe('boson():', function () {
  describe('when a node module is defined:', function () {
    describe('with a config object:', function () {
      it('should load the module', function () {
        var actual = boson('node-foo', {foo: 'bar'});
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(1);
        expect(actual[0]).to.be.an('object');
      });
    });

    describe('without a config object:', function () {
      it('should load the module', function () {
        var actual = boson('node-foo');
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(1);
        expect(actual[0]).to.be.an('object');
      });
    });
  });

  describe('when a both node modules and local files are defined:', function () {
    describe('with a config object:', function () {
      it('should load all of the modules found', function () {
        var actual = boson(['node-*', fixtures('*.js')], {foo: 'bar'});
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(8);
        expect(actual[0]).to.be.an('object');
      });
    });

    describe('without a config object:', function () {
      it('should load all of the modules found', function () {
        var actual = boson(['node-*', fixtures('*.js')]);
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(8);
        expect(actual[0]).to.be.an('object');
      });
    });
  });

  describe('when a glob pattern is defined for npm packages and modules are found:', function () {
    describe('with a config object:', function () {
      it('should require each module', function () {
        var actual = boson('node-*', {foo: 'bar'});
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(3);
        expect(actual[0]).to.be.an('object');
      });
    });
    describe('without a config object:', function () {
      it('should require each module', function () {
        var actual = boson('node-*');
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(3);
        expect(actual[0]).to.be.an('object');
      });
    });
  });

  describe('when a glob pattern is defined for local files and modules are found:', function () {
    describe('with a config object:', function () {
      it('should require each module', function () {
        var actual = boson(fixtures('fixture-*.js'), {foo: 'bar'});
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(4);
        expect(actual[0]).to.be.an('object');
      });

      describe('when globule options are passed as a third argument:', function () {
        it('should pass the options to globule by way of resolve-dep', function () {
          var actual = boson('fixtures/fixture-*.js', {foo: 'bar'}, {cwd: 'test', prefixBase: true});
          expect(actual).to.be.an('array');
          expect(actual).to.have.length(4);
          expect(actual[0]).to.be.an('object');
        });
      });
    });

    describe('when `null` is passed as a config object:', function () {
      it('should require each module', function () {
        var actual = boson(fixtures('fixture-*.js'), null);
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(4);
        expect(actual[0]).to.be.an('object');
      });

      describe('when globule options are passed as a third argument:', function () {
        it('should pass the options to globule by way of resolve-dep', function () {
          var actual = boson('fixtures/fixture-*.js', null, {cwd: 'test', prefixBase: true});
          expect(actual).to.be.an('array');
          expect(actual).to.have.length(4);
          expect(actual[0]).to.be.an('object');
        });
      });
    });

    describe('without a config object:', function () {
      it('should require each module', function () {
        var actual = boson(fixtures('fixture-*.js'));
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(4);
        expect(actual[0]).to.be.an('object');
      });
    });
  });
});


describe('boson.register():', function () {
  describe('when a node module is defined:', function () {
    it('should require the module', function () {
      var actual = boson.register('node-foo');
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(1);
      expect(actual[0]).to.be.an('object');
    });
  });

  describe('when a glob pattern is defined and modules are found:', function () {
    it('should require each module', function () {
      var actual = boson.register('node-*');
      expect(actual).to.be.an('array');
      expect(actual).to.have.length(3);
      expect(actual[0]).to.be.an('object');
    });
  });

  describe('when a both node modules and local files are defined:', function () {
    describe('with a config object:', function () {
      it('should load all of the modules found', function () {
        var actual = boson.register(['node-*', fixtures('*.js')], {foo: 'bar'});
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(8);
        expect(actual[0]).to.be.a('function');
      });
    });

    describe('without a config object:', function () {
      it('should load all of the modules found', function () {
        var actual = boson.register(['node-*', fixtures('*.js')]);
        expect(actual).to.be.an('array');
        expect(actual).to.have.length(8);
        expect(actual[0]).to.be.a('function');
      });
    });
  });
});

