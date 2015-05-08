
import Entities = require('beamQuest/store/entities');
import Maps = require('beamQuest/store/maps');
import UserStore = require('beamQuest/store/userStore');
import PlayerCtrl = require('beamQuest/ctrl/player');

/**
 * @fileoverview ビームの発射などなどを扱う
 */
var socket_;
var io_;

export function listen(socket, io) {
    socket_ = socket;
    io_ = io;

    socket.on('beam:shoot', function(data) {
        var result = data;
        result.success = true;
        var player:any = Entities.getPlayerById(data.shooterId);
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
}

function updateEntityStatus_(entity, beamType, data) {
    var hitResult = {
        entity: entity.model.toJSON(),
        beamTag: data.tag,
        beamPos: {x: data.x, y: data.y}
    };
    entity.beamHit(beamType, data.shooterId);
    io_.sockets.emit('notify:beam:hit:entity', hitResult);
}

/**
 * ビームがあたっていたら対象のEntityを返す
 * @return {model.Mob}
 */
export function isHitEntity_(data) {
    // TODO: マップごとにPVPの可否を切り替える
    var beamPos = {x: data.x, y: data.y};
    var targets = Entities.getMobs() || {};
    var players = Entities.getPlayers();

    var collideRect = {width: 32, height: 32}; // 当たり判定の範囲（これもビームごとに決められるようにしたい）
    var targetPlayer = _.find(players, (player:PlayerCtrl) => {
        return pointInRect_(beamPos, player.model.position, collideRect);
    });

    if (targetPlayer) {
        return targetPlayer;
    }
    return _.find(targets, (target:any) => {
        return pointInRect_(beamPos, target.model.position, collideRect);
    });
}

/**
 * 指定pointが範囲内(rect)に入っていたらtrue
 * @param {Object} beamPoint
 * @param {Object} targetPoint
 * @param {Object} rect
 */
function pointInRect_(beamPoint:any, targetPoint:any, rect:any) {
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
function isHitObject_(data) {
    var beamPos = {x: data.x, y: data.y};

    var map:any = Maps.getMapById(data.mapId) || {};

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

function updateObjStatus_(obj, beamType, data) {
    var hitResult = {
        // obj のIDとか入れる？
        beamTag: data.tag
    };
    io_.sockets.emit('notify:beam:hit:object', hitResult);
}
