var ping = require('beamQuest/listener/ping'),
    login = require('beamQuest/listener/login'),
    Entity = require('beamQuest/listener/entity'),
    Skill = require('beamQuest/listener/skill'),
    Entities = require('beamQuest/store/entities'),
    Item = require('beamQuest/listener/item'),
    MapStore = require('beamQuest/store/maps'),
    mapModel = require('beamQuest/model/fieldMap'),
    Scheduler = require('beamQuest/scheduler'),
    tmx = require('tmx-parser'),
    deferred = require('deferred'),
    usage = require('usage');

exports.start = function(io) {
    /**
     * 依存関係のある初期化処理を逐次実行する
     * @private
     */
    function initDependencies_() {
        var FieldMapCtrl = require('beamQuest/ctrl/fieldMap');
        var d = deferred();
        // NOTE マップ情報の保存先がまだ決まってないので直接書いてる。将来的にはファイルorDBから取ってくる？
        var map = new mapModel({
            id: 1,
            name: 'しんじゅく', // TODO 最初の村の名前は? (iwg)
            maxMobCount: 30,
            mobCount: 0
        });

        tmx.parseFile('public/res/map/map_village.tmx', function(err, m) {
            if (err) throw err;
            map.objTmx = m;
            map.size = {width: m.width * m.tileWidth, height: m.height * m.tileHeight};
            var mapCtrl = new FieldMapCtrl(map);
            MapStore.getInstance().getMaps().push(mapCtrl);
            d.resolve();
        }.bind(this));

        d.promise().then(init_);
    }

    function init_() {
        var config = {
            STEP_INTERVAL: 30 // mainループの間隔(msec)
        };
        Entities.getInstance().init();
        _.each(MapStore.getInstance().getMaps(), function(map) {
            map.initMobs();
        }.bind(this));


        io.sockets.on('connection', function(socket) {
            logger.debug('socket.io connection start');

            login.listen(socket, io);
            ping.listen(socket); // for debug

            socket.emit('connected');
            logger.debug('socket.io connection established');
        });
        setInterval(main, config.STEP_INTERVAL);
        //setInterval(logUsage, 1000);
    }

    function main() {
        Scheduler.getInstance().update();
    }

    function logUsage() {
        "use strict";

        usage.lookup(process.pid, function(err, result) {
            logger.debug('cpu: ' + result.cpu + ', memory: ' + result.memory);
        });
    }

    initDependencies_();
};

