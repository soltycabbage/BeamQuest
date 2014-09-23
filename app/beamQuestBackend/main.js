/// <reference path="../../typings/tsd.d.ts" />
var express = require('express');
var kvs = require('beamQuest/store/kvs');
var entities = require('beamQuest/store/entities');

var router = express.Router();
var client = kvs.createClient();

module.exports = function (app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    router.get('/', function (req, res) {
        var playerNum = _.size(entities.getInstance().getPlayersJSON());
        res.render('index', { env: process.env.NODE_ENV, playerNum: playerNum });
    });

    router.post('/kvs/purge', function (req, res) {
        client.flushall(function (didSucceed) {
            "use strict";

            res.json({});
        });
    });

    return router;
};
//# sourceMappingURL=main.js.map
