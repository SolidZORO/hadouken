/*!
 * layout-stack <https://github.com/doowb/layout-stack>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Build a layout stack.
 *
 * ```js
 * var stack = createStack('2-col-side-nav', layouts);
 * ```
 * @param  {String} `name` The name of the first layout to add to the stack.
 * @param  {Object} `layouts` Possible layout templates tha could be used in the stack.
 * @param  {Object} `options` Options to pass to `assertLayout`.
 * @return {Array} The layout stack starting with the given name.
 * @api public
 * @name  createStack
 */

module.exports = function createStack (name, layouts, opts) {
  opts = opts || {};
  var template = {};
  var stack = [];
  var prev = null;

  while (name && (prev !== name) && (template = layouts[name])) {
    stack.unshift(name);
    prev = name;
    name = assertLayout(template.layout, opts.defaultLayout);
  }
  return stack;
}

/**
 * Assert whether or not a layout should be used based on
 * the given `value`. If a layout should be used, the name of the
 * layout is returned, if not `null` is returned.
 *
 * @param  {*} `value`
 * @return {String|Null} Returns `true` or `null`.
 * @api private
 */

function assertLayout(value, defaultLayout) {
  var isFalsey = require('falsey');
  if (value === false || (value && isFalsey(value))) {
    return null;
  } else if (!value || value === true) {
    return defaultLayout || null;
  } else {
    return value;
  }
}
