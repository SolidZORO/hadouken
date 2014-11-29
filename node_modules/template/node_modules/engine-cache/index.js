'use strict';


var debug = require('debug')('engine-cache');
var Helpers = require('helper-cache');
var slice = require('array-slice');
var extend = require('extend-shallow');
var forOwn = require('for-own');

/**
 * Expose `Engines`
 */

module.exports = Engines;

/**
 * ```js
 * var Engines = require('engine-cache');
 * var engines = new Engines();
 * ```
 *
 * @param {Object} `engines` Optionally pass an object of engines to initialize with.
 * @api public
 */

function Engines(engines) {
  this.init(engines);
}

/**
 * Initialize default configuration.
 *
 * @api private
 */

Engines.prototype.init = function(engines) {
  debug('init', arguments);
  this.cache = engines || {};
};

/**
 * Register the given view engine callback `fn` as `ext`.
 *
 * ```js
 * var consolidate = require('consolidate')
 * engines.setEngine('hbs', consolidate.handlebars)
 * ```
 *
 * @param {String} `ext`
 * @param {Object|Function} `options` or callback `fn`.
 * @param {Function} `fn` Callback.
 * @return {Object} `Engines` to enable chaining.
 * @api public
 */

Engines.prototype.setEngine = function (ext, fn, options) {
  var args = slice(arguments);

  debug('[set]', arguments);
  var engine = {};

  if (args.length === 3) {
    if (options && (typeof options === 'function' ||
        options.hasOwnProperty('render') ||
        options.hasOwnProperty('renderSync') ||
        options.hasOwnProperty('renderFile'))) {
      var opts = fn;
      fn = options;
      options = opts;
    }
  }

  if (typeof fn === 'function') {
    engine.render = fn.render || fn;
    if (fn.renderSync) {
      engine.renderSync = fn.renderSync;
    }
  } else if (typeof fn === 'object') {
    engine = fn || this.noop;
    engine.renderFile = fn.renderFile || fn.__express;
  }
  engine.compile = engine.compile || fn.compile;
  engine.options = engine.options || fn.options || options || {};
  engine.helpers = new Helpers(options);

  if (typeof engine.render !== 'function' && typeof engine.renderSync !== 'function') {
    throw new Error('Engines are expected to have a `render` or `renderSync` method.');
  }

  if (engine.render) {
    engine.name = engine.render.name || 'unknown';
  } else {
    engine.name = engine.renderSync.name || 'unknown';
  }

  this.decorate(engine);

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  debug('[set] %s: %j', ext, engine);
  this.cache[ext] = engine;
  return this;
};

/**
 * Return the engine stored by `ext`. If no `ext`
 * is passed, the entire cache is returned.
 *
 * ```js
 * var consolidate = require('consolidate')
 * engine.setEngine('hbs', consolidate.handlebars);
 *
 * engine.getEngine('hbs');
 * // => {render: [function], renderFile: [function]}
 * ```
 *
 * @param {String} `ext` The engine to get.
 * @return {Object} The specified engine.
 * @api public
 */

Engines.prototype.getEngine = function(ext) {
  if (!ext) {
    return this.cache;
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  var engine = this.cache[ext];
  if (!engine) {
    engine = this.cache['.*'];
  }

  return engine;
};

/**
 * Wrap engines to extend the helpers object and other
 * native methods or functionality.
 *
 * ```js
 * engines.decorate(engine);
 * ```
 *
 * @param  {Object} `engine` The engine to wrap.
 * @return {Object} The wrapped engine.
 * @api private
 */

Engines.prototype.decorate = function(engine) {
  debug('[decorate]', arguments);

  var renderSync = engine.renderSync;
  var render = engine.render;
  var compile = engine.compile || function (str, options) {
    return str;
  };

  engine.render = function(str, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (typeof str !== 'function') {
      str = this.compile(str, options);
    }
    if (typeof str === 'function') {
      return engine.helpers.resolve(str(options), callback);
    }

    var opts = options || {};
    opts.helpers = extend({}, engine.helpers, opts.helpers);
    return render.call(this, str, opts, function (err, content) {
      if (err) return callback(err);
      return engine.helpers.resolve(content, callback);
    });
  };

  engine.renderSync = function(str, options) {
    if (typeof str !== 'function') {
      str = this.compile(str, options);
    }
    if (typeof str === 'function') {
      return str(options);
    }

    var opts = options || {};
    opts.helpers = extend({}, engine.helpers, opts.helpers);
    return renderSync(str, opts);
  };

  engine.compile = function (str, options) {
    if (typeof str === 'function') {
      return str;
    }
    var opts = options || {};
    opts.helpers = extend({}, engine.helpers, opts.helpers);
    return compile(str, opts);
  }
};

/**
 * Load an object of engines onto the `cache`.
 * Mostly useful for testing, but exposed as
 * a public method.
 *
 * ```js
 * engines.load(require('consolidate'))
 * ```
 *
 * @param  {Object} `obj` Engines to load.
 * @return {Object} `Engines` to enable chaining.
 * @api public
 */

Engines.prototype.load = function(obj) {
  debug('[load]', arguments);

  var engines = Object.keys(obj);
  var len = engines.length;
  var i = 0;

  while (i < len) {
    var name = engines[i++];
    var engine = obj[name];
    if (name !== 'clearCache') {
      this.setEngine(name, engine);
    }
  }
  return this;
};

/**
 * Get and set helpers for the given `ext` (engine). If no
 * `ext` is passed, the entire helper cache is returned.
 *
 * **Example:**
 *
 * ```js
 * var helpers = engines.helpers('hbs');
 * helpers.addHelper('foo', function() {});
 * helpers.getHelper('foo');
 * helpers.getHelper();
 * ```
 *
 * See [helper-cache] for any related issues, API details, and documentation.
 *
 * @param {String} `ext` The helper cache to get and set to.
 * @return {Object} Object of helpers for the specified engine.
 * @api public
 */

Engines.prototype.helpers = function (ext) {
  return this.getEngine(ext).helpers;
};

/**
 * Remove `ext` engine from the cache, or if no value is
 * specified the entire cache is reset.
 *
 * **Example:**
 *
 * ```js
 * engines.clear()
 * ```
 *
 * @param {String} `ext` The engine to remove.
 * @api public
 */

Engines.prototype.clear = function(ext) {
  if (ext) {
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }
    delete this.cache[ext];
  } else {
    this.cache = {};
  }
};
