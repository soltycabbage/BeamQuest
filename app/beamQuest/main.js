var ping = require('beamQuest/listener/ping'),
    login = require('beamQuest/listener/login'),
    user = require('beamQuest/listener/user');

exports.start = function(io) {
    io.sockets.on('connection', function(socket) {
        login.listen(socket);
        user.listen(socket);

        // チャット
        socket.on('message:update', function(data) {
            socket.broadcast.emit('notify:message', data);
        });

        // プレイヤーが移動したら位置情報が送られてくる
        socket.on('user:position:update', function(data) {
            // 自分以外の全プレイヤーにブロードキャスト
            socket.broadcast.emit('notify:user:move', data);
        });

        ping.listen(socket);

        socket.emit('connected');
    });
};

