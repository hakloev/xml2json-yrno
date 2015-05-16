var http = require('http'),
    yrAPI = require('./lib/server.js');
   
http.createServer(yrAPI()).listen(3000);
