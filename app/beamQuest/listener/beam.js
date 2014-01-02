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

    /**
     * ビームの位置情報を受け取る
     * @param {Object.<shooterId: string, beamId: number, mapId: number, x: number, y: number>} data
     */
    socket.on('beam:position:update', function(data) {
        
    });
};
