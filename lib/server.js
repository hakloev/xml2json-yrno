var fs = require('fs'),
    xml2js = require('xml2js'),
    request = require('request'),
    util = require('util');

var server = function() {
    
    var parser = new xml2js.Parser();

    var translate = function(callback) {
        
        var buffer = '';

        request
            .get('http://www.yr.no/place/Norway/Vestfold/Tjøme/Tjøme/varsel.xml')
            .on('error', function(err) {
                callback(err, null);
            })
            .on('data', function(data) {
                buffer = buffer + data;
            })
            .on('end', function(data) {
                parser.parseString(buffer, function(err, result) {
                    if (err)
                        callback(err, null);
                    else
                        callback(null, result);
                });
                console.log('Done fetching data!')
            });
    };
    
    return {
        translate: translate
    }

}();

module.exports = server
