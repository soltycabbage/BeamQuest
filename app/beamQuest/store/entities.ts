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

        this.players_ = {};
        this.mobs_ = {};
        this.npcs_ = {};
    }

    /**
     * マップごとのプレイヤー一覧
     * @typedef {
     *    mapId: {
     *       userId: ctrl.Player
     *    }
     * }
     */
    private players_;

    /**
     * マップごとのmob一覧
     * @type {Object}
     */
    private mobs_;

    /**
     * マップごとのnpc一覧
     * @type {Object}
     */
    private npcs_;

    /**
     */
    init() {
        this.players_ = {};
        this.mobs_ = {};
        this.npcs_ = {};
    }

    /**
     * @param {ctrl.Player} player
     */
    addPlayer(player:PlayerCtrl) {
        var isAdd = !_.contains(this.players_, player.model.id);

        if (isAdd) {
            this.players_[player.model.id] = player;
        }
        logger.info('player add [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
    }

    /**
     * @param {string} playerId
     * @return {ctrl.Player}
     */
    getPlayerById(playerId) : PlayerCtrl {
        return this.players_[playerId] || null;
    }

    /**
     * @return {Object}
     */
    getPlayers() {
        return this.players_;
    }

    /**
     * @oaram {number} mapId
     * @return { PlayerCtrl[]}
     */
    getPlayersByMapId(mapId:number):  PlayerCtrl[] {
        return _.filter(this.players_, (player:PlayerCtrl) => {
            return player.model.mapId === mapId;
        });
    }

    /**
     * @param {number} mapId
     * @param {ctrl.Player} player
     */
    removePlayer(player:any) {
        if (this.players_[player.model.id]) {
            delete this.players_[player.model.id];
            logger.info('player remove [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        } else {
            logger.warn('cannot remove player [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        }
    }

    /**
     * @param {model.Map} map
     * @param {ctrl.Mob} mob
     */
    addMob(map:MapModel, mob:any) {
        if (!_.contains(this.mobs_, mob.model.id)) {
            this.mobs_[mob.model.id] = mob;
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
            delete this.mobs_[mob.model.id];
            mob.dispose();
        }
    }

    /**
     * @return {Object}
     */
    getMobs() {
        return this.mobs_;
    }

    /**
     * @return { MobCtrl[] }
     */
     getMobsByMapId(mapId):  MobCtrl[] {
        return _.filter(this.mobs_, (mob:MobCtrl) => {
            return mob.model.mapId === mapId;
        });
    }

    /**
     * @param {string} mobId
     * @return {ctrl.Mob}
     */
    getMobById(mobId) {
        return this.mobs_[mobId] || null;
    }

    /**
     * @param {number} mapId
     * @return {Object}
     */
    getPlayersJSON(mapId:any) {
        var json = {};
        _.each(this.players_, (player:any, key) => {
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
        _.each(this.mobs_, (mob:any, key) => {
            json[key] = mob.model.toJSON();
        });
        return json;
    }

    /**
     * @param {Object.{userId, mapId, x, y}} data
     */
    updatePlayerPosition(data) {
        var player = this.getPlayerById(data.userId);
        if (player) {
            player.model.position.x = data.x;
            player.model.position.y = data.y;
        }
    }

    /**
     * 回避行動中かどうかの状態を更新する
     */
    updatePlayerDodge(data:any) : boolean {
        var player = this.getPlayerById(data.userId);
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
        var mobs:any = this.getMobs();
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, mobs);
    }

    /**
     * 指定座標を中心とする半径rの円内に含まれるPlayerを返す
     * @param {model.Position} targetPos
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    getPlayersByRadius(targetPos:PositionModel, r): EntityCtrl[] {
        var players:any = this.getPlayers();
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, players);
    }

    /**
     * @param {Array.<ctrl.Entity>} entities
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    private getEntitiesStoreByRadiusInternal_(targetPos:PositionModel, r, entities): EntityCtrl[] {
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
