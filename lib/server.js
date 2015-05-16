var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util');

var server = function() {
    
    var parser = new xml2js.Parser();

    var translate = function(callback) {
        fs.readFile(__dirname + '/../varsel.xml', function(err, data) {
            parser.parseString(data, function(err, result) {
                console.log('Done with parsing');
                callback(err, result);
            });
        });
    };
    
    return {
        translate: translate
    }

}();

module.exports = server
