# node-xml-json

[![Build Status](https://travis-ci.org/DataGarage/node-xml-json.png?branch=master)](https://travis-ci.org/DataGarage/node-xml-json)

parse xml to json

## Install

```
npm install xml-to-json
```

## Usage

```javascript
var xml2json = require('xml-to-json')

xml2json({
	input: './sample/sample2.xml',
	output: './sample/test.json'
}, function(err, result) {
  
	if(err) {
		console.error(err);
	} else {
		console.log(result);
	}
  
});
```
In config object, you have to enter an input path. But If you don't want to output any file you can set to `null`.

## License

MIT [@chilijung](http://github.com/chilijung)
