var Entities = require('beamQuest/store/entities');
var Maps = require('beamQuest/store/maps');
var UserStore = require('beamQuest/store/userStore');

/**
* @fileoverview ビームの発射などなどを扱う
*/
var Beam = (function () {
    function Beam() {
        if (Beam.instance_) {
            throw new Error("Error: Instantiation failed: Use Beam.getInstance() instead of new.");
        }
        Beam.instance_ = this;
    }
    Beam.getInstance = function () {
        if (Beam.instance_ === undefined) {
            Beam.instance_ = new Beam();
        }
        return Beam.instance_;
    };

    Beam.prototype.listen = function (socket, io) {
        var _this = this;
        this.socket_ = socket;
        this.io_ = io;

        socket.on('beam:shoot', function (data) {
            UserStore.getInstance().getSessionData(socket.id, 'mapId', function (err, mapId) {
                var result = data;
                result.success = true;
                var player = Entities.getInstance().getPlayerById(data.shooterId);
                if (player) {
                    var beam = player.model.beam;
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
        socket.on('beam:position:update', function (data) {
            // TODO: 誰が撃ったかによって当たり判定の対象を変えたい
            // TODO この部分は消してクライアントにします iwag
            var entity = _this.isHitEntity_(data);
            if (entity) {
                _this.updateEntityStatus_(entity, data.beamId, data);
            }

            // ビーム対オブジェクト
            var obj = _this.isHitObject_(data);
            if (obj) {
                _this.updateObjStatus_(obj, data.beamId, data);
            }
        });
    };

    Beam.prototype.updateEntityStatus_ = function (entity, beamType, data) {
        var hitResult = {
            entity: entity.model.toJSON(),
            beamTag: data.tag,
            beamPos: { x: data.x, y: data.y }
        };
        entity.beamHit(beamType, data.shooterId);
        this.io_.sockets.emit('notify:beam:hit:entity', hitResult);
    };

    /**
    * ビームがあたっていたら対象のEntityを返す
    * @return {model.Mob}
    */
    Beam.prototype.isHitEntity_ = function (data) {
        var _this = this;
        var beamPos = { x: data.x, y: data.y };
        var mobs = Entities.getInstance().getMobs()[data.mapId] || {};
        var collideRect = { width: 32, height: 32 };
        return _.find(mobs, function (mob) {
            return _this.pointInRect_(beamPos, mob.model.position, collideRect);
        });
    };

    /**
    * 指定pointが範囲内(rect)に入っていたらtrue
    * @param {Object} beamPoint
    * @param {Object} targetPoint
    * @param {Object} rect
    */
    Beam.prototype.pointInRect_ = function (beamPoint, targetPoint, rect) {
        var startX = beamPoint.x - rect.width;
        var endX = beamPoint.x + rect.width;
        var startY = beamPoint.y - rect.height;
        var endY = beamPoint.y + rect.height;

        return startX < targetPoint.x && targetPoint.x < endX && startY < targetPoint.y && targetPoint.y < endY;
    };

    /**
    * オブジェクトにあたっていたら対象のEntityを返す
    * @return {model.Mob}
    */
    Beam.prototype.isHitObject_ = function (data) {
        var beamPos = { x: data.x, y: data.y };

        var map = Maps.getInstance().getMapById(data.mapId) || {};

        var tileSize = map.model.objTmx.tileWidth;
        var sizeY = map.model.objTmx.height;

        var layers = map.model.objTmx.layers;
        var passables = _.select(layers, function (layer) {
            return layer && layer.type === 'tile' && layer.properties['beam_no_passable'] === 'true';
        });

        var objs = _.select(passables, function (layer) {
            var gid = layer.tileAt(Math.floor(beamPos.x / tileSize), sizeY - 1 - Math.floor((beamPos.y) / tileSize));
            return gid;
        });
        return objs && objs[0];
    };

    Beam.prototype.updateObjStatus_ = function (obj, beamType, data) {
        var hitResult = {
            // obj のIDとか入れる？
            beamTag: data.tag
        };
        this.io_.sockets.emit('notify:beam:hit:object', hitResult);
    };
    return Beam;
})();

module.exports = Beam;
//# sourceMappingURL=beam.js.map
