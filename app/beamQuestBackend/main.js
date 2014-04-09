var kvs = require('beamQuest/store/kvs').createClient();

exports.listen = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.get('/backend', function(req, res) {
        res.render('index', {env: process.env.NODE_ENV});
    });

    app.post('/backend/kvs/purge', function(req, res) {
        kvs.flushall(function(didSucceed) {
            "use strict";

            res.json({});
        });
    });
};
