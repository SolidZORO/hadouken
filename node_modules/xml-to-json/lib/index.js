var fs = require('fs'),
	path = require('path'),
	xml2js = require('xml2js')

var parser = new xml2js.Parser({explicitArray: false});
	
exports = module.exports = xml2json;

function xml2json (config, callback) {
	if(!config.input) {
		console.error("You miss a input file");
		process.exit(1);
	}

	var cv = new CV(config, callback);
	        
}

function CV(config, cb) {
	var _this = this;
	var input = path.resolve(config.input);
	if(config.output) {
		var output = path.resolve(config.output);
	}else {
		var output = null;
	}

	this.load(input, function(result) {
		_this.write(output, result, function(err, obj) {
			cb(null, obj)
		})	
	});


}

// loading xml
CV.prototype.load = function(input, cb) {
	fs.readFile(input, {encoding: 'UTF-8'}, function(err, data) {
		if (err) throw new Error(err);
		parser.parseString(data, function (err, result) {
			if(err) throw new Error(err);	

			cb(result)
		});
	});

}

// write to file
CV.prototype.write = function(output, data, cb) {
	var record = data
	if(output !== null) {
	  	var stream = fs.createWriteStream(output, { flags : 'w' });
	  	stream.write(JSON.stringify(record));
		cb(null, record);
	}else {
	      	cb(null, record);
	}
}
