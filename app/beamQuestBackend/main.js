var router = require('express').Router(),
    kvs = require('beamQuest/store/kvs').createClient(),
    entities = require('beamQuest/store/entities');

module.exports = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    router.get('/', function(req, res) {
        var playerNum = _.size(entities.getInstance().getPlayersJSON(1));
        res.render('index', {env: process.env.NODE_ENV, playerNum: playerNum});
    });

    router.post('/kvs/purge', function(req, res) {
        kvs.flushall(function(didSucceed) {
            "use strict";

            res.json({});
        });
    });

    return router;
};
