/*!
 * layout-stack <https://github.com/doowb/layout-stack>
 *
 * Copyright (c) 2014 Brian Woodward
 * Licensed under the MIT License (MIT)
 */

'use strict';

var should = require('should');
var createStack = require('./');

describe('.createStack():', function () {

  var layouts = {
    'default': {
      content: 'default above\n{% body %}\ndefault below',
      locals: {title: 'Quux'}
    },
    aaa: {
      content: 'aaa above\n{% body %}\naaa below',
      locals: {title: 'Foo'},
      layout: 'bbb'
    },
    bbb: {
      content: 'bbb above\n{% body %}\nbbb below',
      locals: {title: 'Bar'},
      layout: 'ccc'
    },
    ccc: {
      content: 'ccc above\n{% body %}\nccc below',
      locals: {title: 'Baz'},
      layout: 'default'
    },
    ddd: {
      content: 'ddd above\n{% body %}\nddd below',
      locals: {title: 'Baz'}
    }
  };

  it('should apply a layout to the given string.', function () {
    var layouts = {blah: {content: 'blah above\n{% body %}\nblah below'}};
    createStack('blah', layouts).should.eql(['blah']);
  });

  it('should replace the `{%= body %}` tag in a layout with the given content.', function () {
    createStack('aaa', layouts).should.eql(['default', 'ccc', 'bbb', 'aaa']);
  });

  it('should not replace the `{%= body %}` tag when no content is given to replace it.', function () {
    createStack('bbb', layouts).should.eql(['default', 'ccc', 'bbb']);
  });
});
