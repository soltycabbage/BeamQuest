/**
 * @fileoverview ビームの発射などなどを扱う
 */

var entities = require('beamQuest/store/entities');

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
        // TODO: 誰が撃ったかによって当たり判定の対象を変えたい
        var entity = hitEntity(data);
        if (entity) {
            io.sockets.emit('notify:beam:hit', {entity: entity});
        }
    });

    function hitEntity(data) {
        var beamPos = {x: data.x, y: data.y};
        var mobs = entities.getMobs()[data.mapId] || {};
        var collideRect = {width: 20, height: 20}; // 当たり判定の範囲（これもビームごとに決められるようにしたい）
        return _.find(mobs, function(mob) {
            return pointInRect(beamPos, mob.position, collideRect);
        });
    }

    /**
     * 指定pointが範囲内(rect)に入っていたらtrue
     * @param {Object} beamPoint
     * @param {Object} targetPoint
     * @param {Object} rect
     */
    function pointInRect(beamPoint, targetPoint, rect) {
        var startX = beamPoint.x - rect.width;
        var endX = beamPoint.x + rect.width;
        var startY = beamPoint.y - rect.height;
        var endY = beamPoint.y + rect.height;

        return startX < targetPoint.x && targetPoint.x < endX &&
            startY < targetPoint.y && targetPoint.y < endY;
    }
};
