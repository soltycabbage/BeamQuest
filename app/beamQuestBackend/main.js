var kvs = require('beamQuest/store/kvs').createClient(),
    entities = require('beamQuest/store/entities');

exports.listen = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.get('/backend', function(req, res) {
        var playerNum = _.size(entities.getPlayersJSON(1));
        res.render('index', {env: process.env.NODE_ENV, playerNum: playerNum});
    });

    app.post('/backend/kvs/purge', function(req, res) {
        kvs.flushall(function(didSucceed) {
            "use strict";

            res.json({});
        });
    });
};
