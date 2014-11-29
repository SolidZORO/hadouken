/**
 * Boson <https://github.com/jonschlinkert/boson>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var resolve = require('resolve-dep');


/**
 * Uses a simple `require` on each module found and attempts to pass a config
 * object is one is specified, returning an array of functions or objects
 * exported from local or named npm modules. Wildcard (glob) patterns may be used.
 *
 * **Example**:
 *
 * ```js
 * boson('index.js', {foo: 'bar'}); // index.js file for boson
 * //=> [ { [Function] find: [Function], register: [Function] } ]
 * ```
 *
 * @param   {Array|String}  `patterns` Glob patterns, file paths or named npm modules.
 * @param   {Object}  `config` Optional config object to pass to each function.
 * @param   {Object}  `options` Options to pass to resolve-dep.
 * @return  {Array}
 * @api public
 */

var boson = module.exports = function(patterns, config, options) {
  return boson.register(patterns, options).map(function(fn) {
    if (typeof fn === 'function') {
      try {
        return fn(config);
      } catch (err) {return fn;}
    }
    return fn;
  });
};


/**
 * Returns an array of resolved filepaths for local or named npm modules.
 * Wildcard (glob) patterns may be used.
 *
 * **Example**:
 *
 * _(Returned paths are shortened for example)_.
 *
 * ```js
 * boson.find('mocha');
 * //=> ['~/boson/node_modules/mocha/index.js']
 *
 * boson.find(['mocha', '*.js']);
 * //=> [ '~/boson/index.js', '~/boson/node_modules/mocha/index.js' ]
 *
 * // Optionally pass a config object
 * boson.find(['mocha', '*.js'], {foo: 'bar'});
 * //=> [ '~/boson/index.js', '~/boson/node_modules/mocha/index.js' ]
 * ```
 *
 * @param   {Array|String}  `patterns` Glob patterns, file paths or named npm modules.
 * @param   {Object}  `options` Options to pass to resolve-dep.
 * @return  {Array}
 * @api public
 */

boson.find = function(patterns, options) {
  return resolve(patterns, options);
};


/**
 * Uses a simple `require` on each module found, returning an array of
 * functions or objects exported from local or named npm modules. Wildcard
 * (glob) patterns may be used.
 *
 * **Example**:
 *
 * ```js
 * boson('index.js'); // index.js file for boson
 * //=> [ { [Function] find: [Function], register: [Function] } ]
 * ```
 *
 * @param   {Array|String}  `patterns` Glob patterns, file paths or named npm modules.
 * @param   {Object}  `options` Options to pass to resolve-dep.
 * @return  {Array}
 * @api public
 */

boson.register = function(patterns, options) {
  return boson.find(patterns, options).map(function(filepath) {
    return require(filepath);
  });
};