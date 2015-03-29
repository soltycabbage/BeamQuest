
import Entities = require('beamQuest/store/entities');
import Maps = require('beamQuest/store/maps');
import UserStore = require('beamQuest/store/userStore');

/**
 * @fileoverview ビームの発射などなどを扱う
 */
class Beam {
    private static instance_:Beam;
    public static getInstance():Beam {
        if (Beam.instance_ === undefined) {
            Beam.instance_ = new Beam();
        }
        return Beam.instance_;
    }

    constructor() {
        if (Beam.instance_){
            throw new Error("Error: Instantiation failed: Use Beam.getInstance() instead of new.");
        }
        Beam.instance_ = this;
    }

    private socket_;
    private io_;

    listen(socket, io) {
        this.socket_ = socket;
        this.io_ = io;

        socket.on('beam:shoot', function(data) {
            var result = data;
            result.success = true;
            var player:any = Entities.getInstance().getPlayerById(data.shooterId);
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

        /**
         * ビームの位置情報を受け取る
         * @param {Object.<shooterId: string, beamId: number, mapId: number, x: number, y: number>} data
         */
        socket.on('beam:position:update', (data) => {
            // TODO: 誰が撃ったかによって当たり判定の対象を変えたい
            // TODO この部分は消してクライアントにします iwag
            var entity = this.isHitEntity_(data);
            if (entity) {
                this.updateEntityStatus_(entity, data.beamId, data);
            }
            // ビーム対オブジェクト
            var obj = this.isHitObject_(data);
            if ( obj ) {
                this.updateObjStatus_(obj, data.beamId, data);
            }
        });
    }

    private updateEntityStatus_(entity, beamType, data) {
        var hitResult = {
            entity: entity.model.toJSON(),
            beamTag: data.tag,
            beamPos: {x: data.x, y: data.y}
        };
        entity.beamHit(beamType, data.shooterId);
        this.io_.sockets.emit('notify:beam:hit:entity', hitResult);
    }

    /**
     * ビームがあたっていたら対象のEntityを返す
     * @return {model.Mob}
     */
    private isHitEntity_(data) {
        var beamPos = {x: data.x, y: data.y};
        var mobs:any = Entities.getInstance().getMobs() || {};
        var collideRect = {width: 32, height: 32}; // 当たり判定の範囲（これもビームごとに決められるようにしたい）
        return _.find(mobs, (mob:any) => {
            return this.pointInRect_(beamPos, mob.model.position, collideRect);
        });
    }

    /**
     * 指定pointが範囲内(rect)に入っていたらtrue
     * @param {Object} beamPoint
     * @param {Object} targetPoint
     * @param {Object} rect
     */
    private pointInRect_(beamPoint:any, targetPoint:any, rect:any) {
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
     */
    private isHitObject_(data) {
        var beamPos = {x: data.x, y: data.y};

        var map:any = Maps.getInstance().getMapById(data.mapId) || {};

        var tileSize = map.model.objTmx.tileWidth;
        var sizeY = map.model.objTmx.height;

        var layers:any = map.model.objTmx.layers;
        var passables:any[] = _.select(layers, (layer:any) => {
            return layer && layer.type === 'tile' && layer.properties['beam_no_passable'] === 'true';
        });


        var objs= _.select(passables, (layer) => {
            var gid = layer.tileAt(Math.floor(beamPos.x/tileSize),
                sizeY -1 -  Math.floor((beamPos.y)/tileSize));
            return gid;
        });
        return objs && objs[0];
    }

    private updateObjStatus_(obj, beamType, data) {
        var hitResult = {
            // obj のIDとか入れる？
            beamTag: data.tag
        };
        this.io_.sockets.emit('notify:beam:hit:object', hitResult);
    }
}

export = Beam;
