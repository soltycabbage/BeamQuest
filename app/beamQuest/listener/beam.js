/**
 * @fileoverview ビームの発射などなどを扱う
 */

var entities = require('beamQuest/store/entities');
var maps = require('beamQuest/store/maps');
var userStore = require('beamQuest/store/userStore');

exports.listen = function(socket, io) {
    socket.on('beam:shoot', function(data) {
        userStore.getSessionData(socket.id, 'mapId', function(err, mapId) {
            var result = data;
            result.success = true;
            var player = entities.getPlayerById(mapId, data.shooterId);
            if (player) {
                var beam =  player.model.beam;
                result.beamId = beam.id;
                result.beamSpeed = beam.speed;
                result.beamDuration = beam.duration;
                if (beam.bp <= player.model.bp) {
                    player.model.addBp(-beam.bp);
                } else {
                    // BPが足りないのでビームは撃てないよみたいなアナウンスを入れる
                    socket.emit('user:status:bp:lack');
                    return;
                }
            }
            io.sockets.emit('notify:beam:shoot', result);
        });
    });

    /**
     * ビームの位置情報を受け取る
     * @param {Object.<shooterId: string, beamId: number, mapId: number, x: number, y: number>} data
     */
    socket.on('beam:position:update', function(data) {
        // TODO: 誰が撃ったかによって当たり判定の対象を変えたい
        // TODO この部分は消してクライアントにします iwag
        var entity = isHitEntity_(data);
        if (entity) {
            updateEntityStatus_(entity, data.beamId, data);
        }
        // ビーム対オブジェクト
        var obj = isHitObject_(data);
        if ( obj ) {
            updateObjStatus_(obj, data.beamId, data);
        }
    });

    function updateEntityStatus_(entity, beamType, data) {
        var hitResult = {
            entity: entity.model.toJSON(),
            beamTag: data.tag,
            beamPos: {x: data.x, y: data.y}
        };
        entity.beamHit(beamType, data.shooterId, data.mapId);
        io.sockets.emit('notify:beam:hit:entity', hitResult);
    }

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
            return pointInRect_(beamPos, mob.model.position, collideRect);
        });
    }

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
    }

    /**
     * オブジェクトにあたっていたら対象のEntityを返す
     * @return {model.Mob}
     * @private
     */
    function isHitObject_(data) {
        var beamPos = {x: data.x, y: data.y};

        var map = maps.getMapById(data.mapId) || {};

        var tileSize = map.model.objTmx.tileWidth;
        var sizeY = map.model.objTmx.height;

        var passables = _.select(map.model.objTmx.layers, function(layer) {
            return layer && layer.type === 'tile' && layer.properties['beam_no_passable'] === 'true';
        } );


        var objs= _.select(passables, function(layer){
            var gid = layer.tileAt(Math.floor(beamPos.x/tileSize),
                sizeY -1 -  Math.floor((beamPos.y)/tileSize));
            return gid;
        });
        return objs && objs[0];
    }

    function updateObjStatus_(obj, beamType, data) {
        var hitResult = {
            // obj のIDとか入れる？
            beamTag: data.tag
        };
        io.sockets.emit('notify:beam:hit:object', hitResult);
    }

};
