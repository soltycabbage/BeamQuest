/// <reference path="../../../typings/deferred/deferred.d.ts" />

import EntityListener = require('beamQuest/listener/entity');
import MapStore = require('beamQuest/store/maps');
import MapModel = require('beamQuest/model/fieldMap');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import PlayerCtrl = require('beamQuest/ctrl/player');
import deferred = require('deferred');

declare var logger: any;

/**
 * ゲーム内のEntityの状態を保持しておくクラス
 */
class EntitiesStore {
    private static instance_:EntitiesStore;
    public static getInstance():EntitiesStore {
        if (EntitiesStore.instance_ === undefined) {
            EntitiesStore.instance_ = new EntitiesStore();
        }
        return EntitiesStore.instance_;
    }

    constructor() {
        if (EntitiesStore.instance_){
            throw new Error("Error: Instantiation failed: Use EntitiesStore.getInstance() instead of new.");
        }
        EntitiesStore.instance_ = this;

        this.mapPlayers_ = {};
        this.mapMobs_ = {};
        this.mapNpcs_ = {};
    }

    /**
     * マップごとのプレイヤー一覧
     * @typedef {
     *    mapId: {
     *       userId: ctrl.Player
     *    }
     * }
     */
    private mapPlayers_;

    /**
     * マップごとのmob一覧
     * @type {Object}
     */
    private mapMobs_;

    /**
     * マップごとのnpc一覧
     * @type {Object}
     */
    private mapNpcs_;

    /**
     * @return {deferred.promise}
     */
    init() {
        var d = deferred();
        _.each(MapStore.getInstance().getMaps(), (map:any) => {
            this.mapPlayers_[map.model.id] = {};
            this.mapMobs_[map.model.id] = {};
            this.mapNpcs_[map.model.id] = {};

        });
        return d.resolve();
    }

    /**
     * @param {number} mapId
     * @param {ctrl.Player} player
     */
    addPlayer(mapId, player:any) {
        var players = this.mapPlayers_[mapId] || [],
            isAdd = !_.contains(players, player.model.id);

        if (isAdd) {
            players[player.model.id] = player;
        }
        logger.info('player add [mapId=' + mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
    }

    /**
     * @param {number} mapId
     * @param {string} playerId
     * @return {ctrl.Player}
     */
    getPlayerById(mapId, playerId) : PlayerCtrl {
        if (this.mapPlayers_[mapId]) {
            return this.mapPlayers_[mapId][playerId] || null;
        }
        return null;
    }

    /**
     * @return {Object}
     */
    getPlayers() {
        return this.mapPlayers_;
    }

    /**
     * @param {number} mapId
     * @return {Array.<ctrl.Player>}
     */
    getPlayersByMapId(mapId:number) {
        return this.mapPlayers_[mapId];
    }

    /**
     * @param {number} mapId
     * @param {ctrl.Player} player
     */
    removePlayer(mapId:number, player:any) {
        var players = this.mapPlayers_[mapId] || [];

        if (players[player.model.id]) {
            delete players[player.model.id];
            logger.info('player remove [mapId=' + mapId + ',playerId=' + player.model.id + ']');
        } else {
            logger.warn('cannot remove player [mapId=' + mapId + ',playerId=' + player.model.id + ']');
        }
    }

    /**
     * @param {model.Map} map
     * @param {ctrl.Mob} mob
     */
    addMob(map:MapModel, mob:any) {
        var mobs = this.mapMobs_[map.id] || [];
        if (!_.contains(mobs, mob.model.id)) {
            mobs[mob.model.id] = mob;
            map.mobCount++;
            EntityListener.getInstance().popMob(mob);
        }
    }

    /**
     * @param {ctrl.Mob} mob
     */
    removeMob(mob:any) {
        var map:any = MapStore.getInstance().getMapById(mob.model.position.mapId);
        if (map) {
            map.model.mobCount--;
            delete this.mapMobs_[map.model.id][mob.model.id];
            mob.dispose();
        }
    }

    /**
     * @return {Object}
     */
    getMobs() {
        return this.mapMobs_;
    }

    /**
     * @param {number} mapId
     * @return {Array.<ctrl.Mob>}
     */
     getMobsByMapId(mapId) {
        return this.mapMobs_[mapId];
    }

    /**
     * @param {number mapId
     * @param {string} mobId
     * @return {ctrl.Mob}
     */
    getMobById(mapId, mobId) {
        if (this.mapMobs_[mapId]) {
            return this.mapMobs_[mapId][mobId] || null;
        }
        return null;
    }

    /**
     * @param {number} mapId
     * @return {Object}
     */
    getPlayersJSON(mapId:any) {
        var json = {};
        var players = this.mapPlayers_[mapId] || [];
        _.each(players, (player:any, key) => {
            json[key] = player.model.toJSON();
        });
        return json;
    }


    /**
     * @param {number} mapId
     * @return {Object}
     */
    getMobsJSON(mapId:number) {
        var json = {};
        var mobs = this.mapMobs_[mapId] || [];
        _.each(mobs, (mob:any, key) => {
            json[key] = mob.model.toJSON();
        });
        return json;
    }

    /**
     * @param {Object.{userId, mapId, x, y}} data
     */
    updatePlayerPosition(data) {
        var player = this.getPlayerById(data.mapId, data.userId);
        if (player) {
            player.model.position.mapId = data.mapId;
            player.model.position.x = data.x;
            player.model.position.y = data.y;
        }
    }

    /**
     * 回避行動中かどうかの状態を更新する
     */
    updatePlayerDodge(data:any) : boolean {
        var player = this.getPlayerById(data.mapId, data.userId);
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
    getMobsByRadius(targetPos:PositionModel, r): EntityCtrl[] {
        var mobs:any = this.getMobsByMapId(targetPos.mapId);
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, mobs);
    }

    /**
     * 指定座標を中心とする半径rの円内に含まれるPlayerを返す
     * @param {model.Position} targetPos
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    getPlayersByRadius(targetPos:PositionModel, r): EntityCtrl[] {
        var players:any = this.getPlayersByMapId(targetPos.mapId);
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, players);
    }

    /**
     * @param {Array.<ctrl.Entity>} entities
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    private getEntitiesStoreByRadiusInternal_(targetPos, r, entities): EntityCtrl[] {
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
}

export = EntitiesStore;
