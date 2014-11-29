/*!
 * escape-delims <https://github.com/jonschlinkert/escape-delims>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var EscapeDelims = require('./');
var delims;

describe('escape delims', function () {
  beforeEach(function () {
    delims = new EscapeDelims();
  });

  describe('default delims', function () {
    it('should not transform default delimiters that have not been escaped:', function () {
      var actual = delims.escape('{%= foo %}');
      actual.should.eql('{%= foo %}');
    });

    it('should transform delimiters that have been escaped:', function () {
      var actual = delims.escape('{%%= foo %}');
      actual.should.eql('(;^__^;)= foo (;^_^;)');
    });

    it('should revert delimiters that have been escaped:', function () {
      var actual = delims.unescape('(;^__^;)= foo (;^_^;)');
      actual.should.eql('{%%= foo %}');
    });
  });

  describe('when "default" delimiters are defined on the contructor:', function () {
    it('should not transform default delimiters that have not been escaped:', function () {
      delims = new EscapeDelims(['<%%', '%>']);
      var actual = delims.escape('<%= foo %>');
      actual.should.eql('<%= foo %>');
    });

    it('should transform delimiters that have been escaped:', function () {
      delims = new EscapeDelims(['<%%', '%>']);
      var actual = delims.escape('<%%= foo %>');
      actual.should.eql('(;^__^;)= foo (;^_^;)');
    });

    it('should un-escape delimiters using the `from` syntax:', function () {
      delims = new EscapeDelims(['<%%', '%>']);
      var actual = delims.unescape('(;^__^;)= foo (;^_^;)');
      actual.should.eql('<%%= foo %>');
    });

    it('should un-escape delimiters using the `to` syntax:', function () {
      delims = new EscapeDelims(['<%%', '%>'], ['<%', '%>']);
      var actual = delims.unescape('(;^__^;)= foo (;^_^;)');
      actual.should.eql('<%= foo %>');
    });

    it('should escape and un-escape delimiters:', function () {
      delims = new EscapeDelims(['<%%', '%>'], ['<%', '%>']);
      var actual = delims.escape('<%%= foo %>');
      delims.unescape(actual).should.eql('<%= foo %>');
    });
  });

  describe('lo-dash style delims', function () {
    it('should escape custom delimiters', function () {
      var actual = delims.escape('<%%= foo %>', ['<%%', '%>']);
      actual.should.eql('(;^__^;)= foo (;^_^;)');
    });

    it('should un-escape escaped custom delimiters', function () {
      var actual = delims.unescape('(;^__^;)= foo (;^_^;)', ['<%', '%>']);
      actual.should.eql('<%= foo %>');
    });
  });

  describe('un-escape lodash style delims', function () {
    it('should un-escape escaped custom delimiters', function () {
      var actual = delims.unescape('(;^__^;) abcde (;^_^;)', ['<%=', '%>']);
      actual.should.eql('<%= abcde %>');
    });

    it('should un-escape escaped lodash delimiters in expressions with multiple arguments:', function () {
      var actual = delims.unescape('(;^__^;) abcde(foo, bar) baz(;^_^;)', ['<%=', '%>']);
      actual.should.eql('<%= abcde(foo, bar) baz%>');
    });
  });

  describe('transform handlebars style delims', function () {
    it('should not transform delimiters with whitespace', function () {
      delims = new EscapeDelims(['{{', '}}']);
      var actual = delims.escape('{{ abcde }}', ['{{', '}}']);
      actual.should.eql('(;^__^;) abcde (;^_^;)');
      delims.unescape(actual).should.eql('{{ abcde }}');
    });

    it('should transform delimiters without whitespace', function () {
      var actual = delims.escape('{{abcde}}', ['{{', '}}']);
      actual.should.eql('(;^__^;)abcde(;^_^;)');
      delims.unescape(actual, ['{{', '}}']).should.eql('{{abcde}}');
    });

    it('should transform delimiters with imbalanced whitespace', function () {
      var actual = delims.escape('{{ abcde}}', ['{{', '}}']);
      actual.should.eql('(;^__^;) abcde(;^_^;)');
      delims.unescape(actual, ['{{', '}}']).should.eql('{{ abcde}}');
    });

    it('should transform delimiters in expressions with multiple arguments:', function () {
      var actual = delims.escape('{{ abcde (foo "bar") baz}}', ['{{', '}}']);
      actual.should.eql('(;^__^;) abcde (foo "bar") baz(;^_^;)');
      delims.unescape(actual, ['{{', '}}']).should.eql('{{ abcde (foo "bar") baz}}');
    });

    it('should transform delimiters with whitespace', function () {
      var actual = delims.escape('{{% abcde }}{{ fghijk }}', ['{{%', '}}']);
      actual.should.eql('(;^__^;) abcde (;^_^;){{ fghijk }}');
      delims.unescape(actual, ['{{%', '}}']).should.eql('{{% abcde }}{{ fghijk }}');
    });

    it('should transform delimiters without whitespace', function () {
      var actual = delims.escape('{{%abcde}}{{ fghijk }}', ['{{%', '}}']);
      actual.should.eql('(;^__^;)abcde(;^_^;){{ fghijk }}');
      delims.unescape(actual, ['{{%', '}}']).should.eql('{{%abcde}}{{ fghijk }}');
    });

    it('should transform delimiters with imbalanced whitespace', function () {
      var actual = delims.escape('{{% abcde}}{{ fghijk }}', ['{{%', '}}']);
      actual.should.eql('(;^__^;) abcde(;^_^;){{ fghijk }}');
      delims.unescape(actual, ['{{%', '}}']).should.eql('{{% abcde}}{{ fghijk }}');
    });

    it('should transform delimiters in expressions with multiple arguments:', function () {
      var actual = delims.escape('{{% abcde (foo "bar") baz}}{{ fghijk }}', ['{{%', '}}']);
      actual.should.eql('(;^__^;) abcde (foo "bar") baz(;^_^;){{ fghijk }}');
      delims.unescape(actual, ['{{%', '}}']).should.eql('{{% abcde (foo "bar") baz}}{{ fghijk }}');
    });
  });

  describe('un-escape handlebars style delims', function () {
    it('should un-escape escaped custom delimiters', function () {
      var actual = delims.unescape('(;^__^;) abcde (;^_^;)', ['{{', '}}']);
      actual.should.eql('{{ abcde }}');
    });

    it('should un-escape escaped handlebars delimiters in expressions with multiple arguments:', function () {
      var actual = delims.unescape('(;^__^;) abcde (foo "bar") baz(;^_^;)', ['{{', '}}']);
      actual.should.eql('{{ abcde (foo "bar") baz}}');
    });
  });

  describe('convert delims', function () {
    it('should convert delimiters', function () {
      delims = new EscapeDelims(['<%=', '%>'], ['{{', '}}']);
      var actual = delims.escape('<%= foo %><%= bar %>');
      delims.unescape(actual).should.eql('{{ foo }}{{ bar }}');
    });
  });
});