var express = require('express'),
    fs = require('fs'),
    xml2js = require('xml2js').parseString,
    request = require('request');

var app = express()
var router = express.Router()

/* Available API routes */

module.exports = function() {
    console.log('Starting yr.no API');

    router.get('/forecast/:state/:place', function(req, res) {
        var buffer = '';

        request
            .get('http://www.yr.no/place/Norway/'+ req.params.state +'/' + req.params.place + '/' + req.params.place + '/varsel.xml')
            .on('error', function(err) {
                res.json({error: 'Unable to get weather data'}); // Add params
            })
            .on('data', function(data) {
                buffer = buffer + data;
            })
            .on('end', function(data) {
                xml2js(buffer, function(err, result) {
                    if (err)
                        res.json({error: 'Unable to parse XML to JSON'})
                    else
                        res.json(result)
                });
                console.log('Done fetching data for: ' + req.params.state + ', ' + req.params.place);
            });
    });
    
    app.use('/api/v1', router);

    return app;

}
