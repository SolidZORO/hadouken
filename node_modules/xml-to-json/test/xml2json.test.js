var should = require('should');
var xml2json = require('../');
var fs = require('fs');

describe('xml to json', function() {

	it('should convert xml to json', function() {
		xml2json({
			input: './sample/sample.xml',
			output: null
		}, function(err, result) {
			should.not.exist(err)
			result.should.be.an.instanceOf(Object)
		})
	})

	it('should convert xml to json file', function() {
		xml2json({
			input: './sample/sample.xml',
			output: './sample/test.json'
		}, function(err, result) {
			should.not.exist(err)
			result.should.be.an.instanceOf(Object)
		})

	})

	it('should read file in test.json', function() {
		var exist = fs.existsSync('./sample/test.json')
		exist.should.be.true;
	})

})
