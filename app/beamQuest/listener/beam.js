/**
 * @fileoverview ビームの発射などなどを扱う
 */

exports.listen = function(socket, io) {
    // マップに存在するEntityの一覧を返す
    socket.on('beam:shoot', function(data) {
        var result = data;
        result.success = true;
        io.sockets.emit('notify:beam:shoot', result);
    });
};
