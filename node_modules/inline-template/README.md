# karma-inline-template-preprocessor

> Preprocessor to spit templates into your code on the fly. If you have this in your app's .js files:
```js
{ template: '<%= inlineTemplate('templates/myTemplate.html') %>' }
```
You can turn it into this:
```js
{ template: '<div>My Template!</div>' }
```

Check out grunt-inline-template and karma-inline-template.


## Usage

```js
var inlineTemplate = require('inline-template');
var compiled = inlineTemplate.process("hello, <%= inlineTemplate('hello.html') %>!");
console.log(compiled);
// -> 'hello, <div>My Hello.html</div>'
```

## Options

```js
var inlineTemplate = require('inline-temlpate');
inlineTemplate.options = {
  base: '.', // base folder to read templates from, defaults to '.'
  doubleQuote: false // whether to escape double quotes. Defaults to escaping single quotes.
};
```
