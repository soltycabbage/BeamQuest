/**
 * @fileoverview ビームの発射などなどを扱う
 */

var entities = require('beamQuest/store/entities');
var maps = require('beamQuest/store/maps');

exports.listen = function(socket, io) {
    socket.on('beam:shoot', function(data) {
        var result = data;
        result.success = true;
        var player = entities.getPlayerById(data.mapId, data.shooterId);
        if (player) {
            var bpCost = 1; // @TODO ビームから消費BPを取得
            // var beam = player.getBeam(); こんな感じでビームの種類を取りたい @TODO
            if (bpCost <= player.model.bp) {
                player.model.addBp(-bpCost);
            } else {
                // BPが足りないのでビームは撃てないよみたいなアナウンスを入れる
                socket.emit('user:status:bp:lack');
                return;
            }
        }
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
        var additionalHitResult = entity.beamHit(beamType, data.shooterId, data.mapId);
        hitResult = _.extend(additionalHitResult, hitResult);
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

        var tileSize = map.objTmx.tileWidth;
        var sizeY = map.objTmx.height;

        var passables = _.select(map.objTmx.layers, function(layer) {
            //console.log(layer);
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
