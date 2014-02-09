var params = require('beamQuest/params'),
    ping = require('beamQuest/listener/ping'),
    login = require('beamQuest/listener/login'),
    world = require('beamQuest/listener/world'),
    beam = require('beamQuest/listener/beam'),
    entity = require('beamQuest/listener/entity'),
    entities = require('beamQuest/store/entities'),
    mapStore = require('beamQuest/store/maps'),
    FieldMapCtrl = require('beamQuest/ctrl/fieldMap'),
    scheduler = require('beamQuest/scheduler'),
    usage = require('usage');

exports.start = function(io) {
    /**
     * 依存関係のある初期化処理を逐次実行する
     * @private
     */
    function initDependencies_() {
        var mapDeferred = mapStore.init();
        mapDeferred.then(init_);
    }

    function init_() {
        entities.init();
        var config = {
            STEP_INTERVAL: 30 // mainループの間隔(msec)
        };

        _.each(mapStore.getMaps(), function(map) {
            new FieldMapCtrl(map);
        }.bind(this));

        io.sockets.on('connection', function(socket) {
            login.listen(socket, io);
            world.listen(socket);
            beam.listen(socket, io);
            entity.listen(socket, io);
            ping.listen(socket);

            // チャット
            socket.on('message:update', function(data) {
                socket.broadcast.emit('notify:message', data);
            });

            // プレイヤーが移動したら位置情報が送られてくる
            socket.on('user:position:update', function(data) {
                entities.updatePlayerPosition(data);
                // 自分以外の全プレイヤーにブロードキャスト
                socket.broadcast.emit('notify:user:move', data);
            });

            socket.emit('connected');
        });
        setInterval(main, config.STEP_INTERVAL);
        setInterval(logUsage, 1000);
    }

    function main() {
        scheduler.update();
    }

    function logUsage() {
        "use strict";

        usage.lookup(process.pid, function(err, result) {
            logger.debug('cpu: ' + result.cpu + ', memory: ' + result.memory);
        });
    }

    initDependencies_();
};

