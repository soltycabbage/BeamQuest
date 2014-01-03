/**
 * @fileoverview ビームの発射などなどを扱う
 */

var entities = require('beamQuest/store/entities');

exports.listen = function(socket, io) {
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
        var entity = isHitEntity_(data);
        if (entity) {
            updateEntityStatus_(entity, data.beamId, data);
        }
    });

    function updateEntityStatus_(entity, beamType, data) {
        // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
        //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
        var beam = bq.Params.getBeamParam(beamType);
        var newEntity = _.clone(entity);
        var damage = -1 * (Math.floor(Math.random() * beam.atk/2) + beam.atk); // TODO: ダメージ計算
        var newHp = entity.hp + damage;
        newEntity.hp = newHp;
        entities.updateMobStatus(data.mapId, newEntity);
        io.sockets.emit('notify:beam:hit', {
            entity: newEntity,
            beamTag: data.tag,
            hpAmount: damage,
            beamPos: {x: data.x, y: data.y}
        });
    };

    /**
     * ビームがあたっていたら対象のEntityを返す
     * @return {model.Mob}
     * @private
     */
    function isHitEntity_(data) {
        var beamPos = {x: data.x, y: data.y};
        var mobs = entities.getMobs()[data.mapId] || {};
        var collideRect = {width: 32, height: 32}; // 当たり判定の範囲（これもビームごとに決められるようにしたい）
        return _.find(mobs, function(mob) {
            return pointInRect_(beamPos, mob.position, collideRect);
        });
    };

    /**
     * 指定pointが範囲内(rect)に入っていたらtrue
     * @param {Object} beamPoint
     * @param {Object} targetPoint
     * @param {Object} rect
     */
    function pointInRect_(beamPoint, targetPoint, rect) {
        var startX = beamPoint.x - rect.width;
        var endX = beamPoint.x + rect.width;
        var startY = beamPoint.y - rect.height;
        var endY = beamPoint.y + rect.height;

        return startX < targetPoint.x && targetPoint.x < endX &&
            startY < targetPoint.y && targetPoint.y < endY;
    };
};
