/// <reference path="../../../typings/tsd.d.ts" />

import UserStore = require('beamQuest/store/userStore');
import EntitiesStore = require('beamQuest/store/entities');

/**
 * @fileoverview Entityの状態が変化した時などなどを扱う
 */
var io_;

export function listen(socket, io) {
    io_ = io;

    socket.on('user:position:update', _.partial(handlePlayerMove_, socket));
    socket.on('user:respawn', _.partial(handleRespawn, socket));
    socket.on('user:dodge', _.partial(handleDodge, socket));
    socket.on('user:status:get', _.partial(handleGetStatus_, socket));
}

/**
 * プレイヤーの移動
 * @param {Object} data
 */
function handlePlayerMove_(socket:any, data:any) {
    // プレイヤーが移動したら位置情報が送られてくる
    EntitiesStore.updatePlayerPosition(data);
    // 自分以外の全プレイヤーにブロードキャスト
    socket.broadcast.emit('notify:user:move', data);
}

/**
 * プレイヤーの緊急回避
 */
function handleDodge(socket:any, data:any) {
    if (EntitiesStore.updatePlayerDodge(data)) {
        socket.broadcast.emit('notify:user:dodge', data);
    }
}

/**
 * mobがPOPするよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
export function popMob(mob:any) {
    if (io_) {
        var data = {mob: mob.model.toJSON()};
        io_.sockets.emit('notify:entity:mob:pop', data);
    }
}

/**
 * mobが動いたよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
export function moveMob(mob:any) {
    if (io_) {
        io_.sockets.emit('notify:entity:mob:move', {mob: mob.model.toJSON()});
    }
}

/**
 * mobがタゲったよってクライアントに伝える
 * @param {ctrl.Mob} mob
 * @param {ctrl.Entity} entity
 */
export function targetTo(mob:any, entity:any) {
    var data = {mob: mob.model.toJSON(), target: entity.model.toJSON()};
    io_.sockets.emit('notify:entity:mob:targetTo', data);
}

/**
 * mobが近接攻撃の構えを取ったよってクライアントに伝える
 * @param {string} mobId
 * @param {model.Position} srcPos
 * @param {model.Position} destPos
 * @param {number} range 射程距離(px)
 * @param {number} castTime 発動までの時間(msec)
 */
export function startAttackShortRange(mobId, srcPos, destPos, range, castTime) {
    if (io_) {
        io_.sockets.emit('notify:entity:mob:startAttackShortRange',
            {
                mobId: mobId,
                srcPos: srcPos,
                destPos: destPos,
                range: range,
                castTime: castTime
            });
    }
}

/**
 * hpの増減をクライアントに伝える
 * @param {Array.<entity: model.Entity, hpAmount: number, isCritical: boolean>} hpAmounts
 */
export function updateHp(data){
    if (io_) {
        io_.sockets.emit('notify:entity:hp:update', {hpDatas: data});
    }
}

/**
 * bpの増減をクライアントに伝える
 * @param {Object.<entity: model.Player, bpAmount: number, isCritical: boolean>} data
 */
export function updateBp(data) {
    if (io_ && data.entity) {
        data.entity.socket.emit('user:status:bp:update', data);
    }
}

/**
 * Mob殺すよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
export function killMob(mob:any) {
    var data = {entity: mob.model.toJSON()};
    io_.sockets.emit('notify:entity:mob:kill', data);
    _.each(mob.hateList, (hate:any) => {
        addExp(hate.entityId, mob);
    });
}

/**
 * mobのもつ経験値をplayerに与える
 * @param {string} playerId
 * @param {ctrl.Mob} mob
 */
export function addExp(playerId, mob:any) {
    var player:any = EntitiesStore.getPlayerById(playerId);
    if (player) {
        player.addExp(mob.model.exp);
        player.model.socket.emit('user:status:exp:update', {
            exp: mob.model.exp,
            prevLvExp: player.model.prevLvExp,
            currentExp: player.model.exp,
            nextLvExp: player.model.nextLvExp,
            mobName: mob.model.name
        });
    }
}

/**
 * レベルアップしたよってクライアントに伝える
 * @param {model.Player} playerModel
 */
export function levelUp(playerModel) {
    io_.sockets.emit('notify:entity:player:levelup', playerModel);
}

/**
 * player死んだよってクライアントに伝える
 * @param player
 */
export function killPlayer(player) {
    var data = {entity: player.model.toJSON()};
    io_.sockets.emit('notify:entity:player:kill', data);
}

/**
 * プレイヤーが復活したよ
 * @param {Object} data
 */
export function handleRespawn(socket:any, data:any) {
    if (data) {
        var playerId = data.id;
        var player:any = EntitiesStore.getPlayerById(playerId);
        if (player) {
            player.respawn();
            var d = {entity: player.model.toJSON()};
            socket.broadcast.emit('notify:entity:player:respawn', d);
        }
    }
}

/**
 * entityのステータスを返す
 * @param {Object} data
 * @private
 */
function handleGetStatus_(socket:any, data:any) {
    if (data && socket) {
        var player:any = EntitiesStore.getPlayerById(data.entityId);
        if (player) {
            socket.emit('user:status:receive', player.model.toJSON());
        }
    }
}
