expect = require('chai').expect

describe 'inline-template', ->
  inlineTemplate = require('../lib/index.js')

  it 'should change <%= inlineTemplate %> to inline template', ->
    expect(inlineTemplate.process 'hello, <%= inlineTemplate("test/hello.html") %>')
      .to.equal 'hello, <div>Hello!</div>'

  it 'should set base directory', ->
    inlineTemplate.options.base = 'test'
    expect(inlineTemplate.process 'hello, <%= inlineTemplate("hello.html") %>')
      .to.equal 'hello, <div>Hello!</div>' 
    inlineTemplate.options.base = '.'

  it 'should escape single quotes by default', ->
    expect(inlineTemplate.process 'yes. <%= inlineTemplate("test/singleQuote.html") %>')
      .to.equal """yes. <div>\\'Single quote "string"\\'</div>"""

  it 'should escape double quotes by default', ->
    inlineTemplate.options.doubleQuote = true
    expect(inlineTemplate.process '<%= inlineTemplate("test/doubleQuote.html") %>')
      .to.equal """<span>\\"Here is a 'double quote' string\\"!</span>"""
