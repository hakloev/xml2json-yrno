var express = require('express'),
    fs = require('fs'),
    xml2js = require('xml2js').parseString,
    request = require('request');

var app = express()
var router = express.Router()

var xmlParsingOptions = {
    trim: true,
    explicitArray: false
};

var prettify = function(data, callback) {
    xml2js(data, xmlParsingOptions, function(err, res) {
        if (err) {
            callback(err, null);
            return;
        }
        var result = {},
            weatherData = res.weatherdata; // Add error check here
    
        if (weatherData === undefined || weatherData.location.name === undefined) { 
            callback({message: 'No weather data returned from yr.no API'}, null);  
            return;
        }

        result.location = {
            place: weatherData.location.name,
            lon: weatherData.location.location.$.longitude,
            lat: weatherData.location.location.$.latitude
        }
        result.meta = {
            updated: weatherData.meta.lastupdate,
            nextUpdate: weatherData.meta.nextupdate,
            copyright: {
                url: weatherData.credit.link.$.url,
                text: weatherData.credit.link.$.text
            } 
        }
        
        result.forecastText = []

        weatherData.forecast.text.location.time.forEach(function(info) {
            result.forecastText.push({
                duration: {
                    day: info.title,
                    from: info.$.from,
                    to: info.$.to
                },
                description: info.body
            });
        });

        result.forecastNumbers = []
        
        weatherData.forecast.tabular.time.forEach(function(info) {
            result.forecastNumbers.push({
                precipitation: info.precipitation.$,
                windDirection: info.windDirection.$,
                windSpeed: info.windSpeed.$,
                temperature: info.temperature.$,
                pressure: info.pressure.$,
                symbol: info.symbol.$,
                duration: {
                    from: info.$.from,
                    to: info.$.to
                }

            });
        });
        
        callback(null, result);
    }); 
};

/* Available API routes */

module.exports = function() {
    //console.log('Starting yr.no API');
   
    router.get('/forecast/:state/:municipality/:place', function(req, res) {
        var buffer = '';
            
        request
            .get('http://www.yr.no/place/Norway/'
                + req.params.state +'/' 
                + req.params.municipality + '/' 
                + req.params.place 
                + '/varsel.xml')
            .on('error', function(err) {
                res.json({error: 'Unable to get weather data for: ' + req.params.state + ', ' + req.params.place}); 
            })
            .on('data', function(data) {
                buffer = buffer + data;
            })
            .on('end', function(data) {
                prettify(buffer, function(err, data) {
                    if (err) {
                        //res.json({error: "Something didn't go as we planned..."})
                        res.json(err);
                        return;
                    }
                    
                    res.json(data);
                });
                //console.log('Done fetching data for: ' + req.params.state + ', ' + req.params.place);
            });
    });
    
    router.get('/forecast/:state/:place/hourly', function(req, res) {
        res.json({success: 'Here be dragons and stuff!'}); 
    });

    router.get('/forecast/:state/:place/longterm', function(req, res) {
        res.json({success: 'Here be dragons and stuff!'});
    });
    
    app.use('/api/v1', router);

    return app;

}
