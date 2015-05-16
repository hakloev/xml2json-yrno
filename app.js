var express = require('express'),
    srv = require('./lib/server.js')
    app = express();
   
var router = express.Router();

router.route('/yr')
    .get(function(req, res) {
        srv.translate(function(err, data) {
            if (err)
                res.send(err)
            else 
                res.json(data)
        });
    });

app.use('/api/v1', router);

app.listen(3000)
