var params = require('beamQuest/params'),
    ping = require('beamQuest/listener/ping'),
    login = require('beamQuest/listener/login'),
    world = require('beamQuest/listener/world'),
    beam = require('beamQuest/listener/beam'),
    entities = require('beamQuest/store/entities'),
    mobEvent = require('beamQuest/activeEvent/mob');

exports.start = function(io) {
    // active event
    mobEvent.run();

    io.sockets.on('connection', function(socket) {
        login.listen(socket);
        world.listen(socket);
        beam.listen(socket, io);

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

        ping.listen(socket);

        socket.emit('connected');
    });
};

