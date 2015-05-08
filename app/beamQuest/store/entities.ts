/// <reference path="../../../typings/deferred/deferred.d.ts" />

import EntityListener = require('beamQuest/listener/entity');
import MapStore = require('beamQuest/store/maps');
import MapModel = require('beamQuest/model/fieldMap');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import PlayerCtrl = require('beamQuest/ctrl/player');
import MobCtrl = require('beamQuest/ctrl/mob/mob');
import deferred = require('deferred');

declare var logger: any;

/**
 * ゲーム内のEntityの状態を保持しておくモジュール
 */


/**
 * マップごとのプレイヤー一覧
 * @typedef {
     *    id: {
     *       userId: ctrl.Player
     *    }
     * }
 */
var players_:_.Dictionary<PlayerCtrl> = {};

/**
 * マップごとのmob一覧
 * @type {Object}
 */
var mobs_:_.Dictionary<MobCtrl> = {};

/**
 * マップごとのnpc一覧
 * @type {Object}
 */
var npcs:_.Dictionary<any> = {};

/**
 * @param {ctrl.Player} player
 */
export function addPlayer(player:PlayerCtrl) {
    var isAdd = !_.has(players_, player.model.id);

    if (isAdd) {
        players_[player.model.id] = player;
    }
    logger.info('player add [mapId=' + player.model.mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
}

/**
 * @param {string} playerId
 * @return {ctrl.Player}
 */
export function getPlayerById(playerId) : PlayerCtrl {
    return players_[playerId] || null;
}

/**
 * @return {Object}
 */
export function getPlayers() {
    return players_;
}

/**
 * @oaram {number} mapId
 * @return { PlayerCtrl[]}
 */
export function getPlayersByMapId(mapId:number):  PlayerCtrl[] {
    return _.filter(players_, (player:PlayerCtrl) => {
        return player.model.mapId === mapId;
    });
}

/**
 * @param {number} mapId
 * @param {ctrl.Player} player
 */
export function removePlayer(player:any) {
    if (players_[player.model.id]) {
        delete players_[player.model.id];
        logger.info('player remove [mapId=' + player.model.mapId + ',playerId=' + player.model.id + ']');
    } else {
        logger.warn('cannot remove player [mapId=' + player.model.mapId + ',playerId=' + player.model.id + ']');
    }
}

/**
 * @param {model.Map} map
 * @param {ctrl.Mob} mob
 */
export function addMob(map:MapModel, mob:any) {
    if (!_.has(mobs_, mob.model.id)) {
        mobs_[mob.model.id] = mob;
        map.mobCount++;
        EntityListener.popMob(mob);
    }
}

/**
 * @param {ctrl.Mob} mob
 */
export function removeMob(mob:any) {
    var map:any = MapStore.getMapById(mob.model.mapId);
    if (map) {
        map.model.mobCount--;
        delete mobs_[mob.model.id];
        mob.dispose();
    }
}

/**
 * @return {Object}
 */
export function getMobs() {
    return mobs_;
}

/**
 * @return { MobCtrl[] }
 */
export function getMobsByMapId(mapId):  MobCtrl[] {
    return _.filter(mobs_, (mob:MobCtrl) => {
        return mob.model.mapId === mapId;
    });
}

/**
 * @param {string} mobId
 * @return {ctrl.Mob}
 */
export function getMobById(mobId) {
    return mobs_[mobId] || null;
}

/**
 * @param {number} mapId
 * @return {Object}
 */
export function getPlayersJSON(mapId:any) {
    var json = {};
    _.each(players_, (player:any, key) => {
        json[key] = player.model.toJSON();
    });
    return json;
}


/**
 * @param {number} mapId
 * @return {Object}
 */
export function getMobsJSON(mapId:number) {
    var json = {};
    _.each(mobs_, (mob:any, key) => {
        json[key] = mob.model.toJSON();
    });
    return json;
}

/**
 * @param {Object.{userId, mapId, x, y}} data
 */
export function updatePlayerPosition(data) {
    var player = getPlayerById(data.userId);
    if (player) {
        player.model.position.x = data.x;
        player.model.position.y = data.y;
    }
}

/**
 * 回避行動中かどうかの状態を更新する
 */
export function updatePlayerDodge(data:any) : boolean {
    var player = getPlayerById(data.userId);
    if (player) {
        player.model.setDodge(true);
        return true;
    }
    return false;
}

/**
 * 指定座標を中心とする半径rの円内に含まれるMobを返す
 * @param {model.Position} targetPos
 * @param {number} r
 * @return {Array.<ctrl.Entity>}
 */
export function getMobsByRadius(targetPos:PositionModel, r): EntityCtrl[] {
    var mobs:any = getMobs();
    return getEntitiesStoreByRadiusInternal_(targetPos, r, mobs);
}

/**
 * 指定座標を中心とする半径rの円内に含まれるPlayerを返す
 * @param {model.Position} targetPos
 * @param {number} r
 * @return {Array.<ctrl.Entity>}
 */
export function getPlayersByRadius(targetPos:PositionModel, r): EntityCtrl[] {
    var players:any = getPlayers();
    return getEntitiesStoreByRadiusInternal_(targetPos, r, players);
}

/**
 * @param {Array.<ctrl.Entity>} entities
 * @param {number} r
 * @return {Array.<ctrl.Entity>}
 */
function getEntitiesStoreByRadiusInternal_(targetPos:PositionModel, r, entities): EntityCtrl[] {
    var result = [];
    var r2 = Math.pow(r, 2);

    _.forEach(entities, (entity:any) => {
        var px = entity.model.position.x - targetPos.x;
        var py = entity.model.position.y - targetPos.y;
        var entDist = Math.pow(px, 2) + Math.pow(py, 2);
        if (r2 >= entDist) {
            result.push(entity);
        }
    });
    return result;
}
