var params = require('beamQuest/params'),
    ping = require('beamQuest/listener/ping'),
    login = require('beamQuest/listener/login'),
    world = require('beamQuest/listener/world'),
    beam = require('beamQuest/listener/beam'),
    entity = require('beamQuest/listener/entity'),
    entities = require('beamQuest/store/entities'),
    mobEvent = require('beamQuest/activeEvent/mob'),
    scheduler = require('beamQuest/scheduler');

exports.start = function(io) {
    var config = {
        STEP_INTERVAL: 30 // mainループの間隔(msec)
    };

    // active event
    mobEvent.run();

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


    function main() {
        scheduler.update();
    }

    setInterval(main, config.STEP_INTERVAL);
};

