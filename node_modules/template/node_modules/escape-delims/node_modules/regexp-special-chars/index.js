/*!
 * regexp-special-chars <https://github.com/jonschlinkert/regexp-special-chars>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

// See: http://www.regular-expressions.info/characters.html#special
module.exports = /[\]\/\\$()*+.?[^{|}]/g;