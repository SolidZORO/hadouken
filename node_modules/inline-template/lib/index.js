
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var defaultOptions = {
  base: '.',
  doubleQuote: false
};
module.exports = {
  options: defaultOptions,
  process: function(str, opts) {
    opts = opts || {};

    var doubleQuote = opts.doubleQuote || defaultOptions.doubleQuote;
    var base = opts.base || defaultOptions.base;

    var compiled = _.template(str, {
      inlineTemplate: inlineTemplate
    });

    return compiled;

    function inlineTemplate(templateUrl) {
      var filepath = path.resolve(base, templateUrl);
      return escapeContent( fs.readFileSync(filepath).toString() );
    }

    function escapeContent(content) {
      content = content.replace(/\r?\n/g, '');
      if (doubleQuote) {
        return content.replace(/"/g, "\\\"");
      } else {
        return content.replace(/'/g, '\\\'');
      }
    }
  }
};
