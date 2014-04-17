var router = require('express').Router(),
    kvs = require('beamQuest/store/kvs').createClient();

module.exports = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    router.get('/', function(req, res) {
        res.render('index', {env: process.env.NODE_ENV});
    });

    router.post('/kvs/purge', function(req, res) {
        kvs.flushall(function(didSucceed) {
            "use strict";

            res.json({});
        });
    });

    return router;
};
