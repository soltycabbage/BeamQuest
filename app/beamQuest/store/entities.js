/// <reference path="../../../typings/deferred/deferred.d.ts" />
var EntityListener = require('beamQuest/listener/entity');
var MapStore = require('beamQuest/store/maps');
/**
 * ゲーム内のEntityの状態を保持しておくクラス
 */
var EntitiesStore = (function () {
    function EntitiesStore() {
        if (EntitiesStore.instance_) {
            throw new Error("Error: Instantiation failed: Use EntitiesStore.getInstance() instead of new.");
        }
        EntitiesStore.instance_ = this;
        this.players_ = [];
        this.mobs_ = [];
        this.npcs_ = {};
    }
    EntitiesStore.getInstance = function () {
        if (EntitiesStore.instance_ === undefined) {
            EntitiesStore.instance_ = new EntitiesStore();
        }
        return EntitiesStore.instance_;
    };
    EntitiesStore.prototype.init = function () {
        this.players_ = [];
        this.mobs_ = [];
        this.npcs_ = [];
    };
    /**
     * @param {ctrl.Player} player
     */
    EntitiesStore.prototype.addPlayer = function (player) {
        var isAdd = !_.contains(this.players_, player.model.id);
        if (isAdd) {
            this.players_[player.model.id] = player;
        }
        logger.info('player add [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
    };
    /**
     * @param {string} playerId
     * @return {ctrl.Player}
     */
    EntitiesStore.prototype.getPlayerById = function (playerId) {
        return this.players_[playerId] || null;
    };
    /**
     * @return PlayerCtrl[]
     */
    EntitiesStore.prototype.getPlayers = function () {
        return this.players_;
    };
    /**
     * @param {string} mapId
     * @return {PlayerCtrl[]}
     */
    EntitiesStore.prototype.getPlayersByMapId = function (mapId) {
        return _.filter(this.players_, function (player) {
            return player.model.mapId === mapId;
        });
    };
    /**
     * @param {ctrl.Player} player
     */
    EntitiesStore.prototype.removePlayer = function (player) {
        if (this.players_[player.model.id]) {
            delete this.players_[player.model.id];
            logger.info('player remove [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        }
        else {
            logger.warn('cannot remove player [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        }
    };
    /**
     * @param {model.Map} map
     * @param {ctrl.Mob} mob
     */
    EntitiesStore.prototype.addMob = function (map, mob) {
        logger.debug(mob.model.id, mob.model.position);
        if (!_.contains(this.mobs_, mob.model.id)) {
            this.mobs_[mob.model.id] = mob;
            map.mobCount++;
            EntityListener.getInstance().popMob(mob);
        }
    };
    /**
     * @param {ctrl.Mob} mob
     */
    EntitiesStore.prototype.removeMob = function (mob) {
        var map = MapStore.getInstance().getMapById(mob.model.position.mapId);
        if (map) {
            map.model.mobCount--;
            delete this.mobs_[map.model.id][mob.model.id];
            mob.dispose();
        }
    };
    /**
     * @return {MobCtrl[]}
     */
    EntitiesStore.prototype.getMobs = function () {
        return this.mobs_;
    };
    /**
     * @param {string} mapId
     * @return {MobCtrl[]}
     */
    EntitiesStore.prototype.getMobsByMapId = function (mapId) {
        return _.filter(this.mobs_, function (mob) {
            return mob.model.mapId === mapId;
        });
    };
    /**
     * @param {string} mobId
     * @return {ctrl.Mob}
     */
    EntitiesStore.prototype.getMobById = function (mobId) {
        return this.mobs_[mobId] || null;
    };
    /**
     * @param {string} mapId
     * @return {Object}
     */
    EntitiesStore.prototype.getPlayersJSON = function (mapId) {
        var json = {};
        _.each(this.getPlayersByMapId(mapId), function (player, key) {
            json[key] = player.model.toJSON();
        });
        return json;
    };
    /**
     * @param {string} mapId
     * @return {Object}
     */
    EntitiesStore.prototype.getMobsJSON = function (mapId) {
        var json = {};
        _.each(this.getMobsByMapId(mapId), function (mob, key) {
            json[key] = mob.model.toJSON();
        });
        return json;
    };
    /**
     * @param {Object.{userId, mapId, x, y}} data
     */
    EntitiesStore.prototype.updatePlayerPosition = function (data) {
        var player = this.players_[data.userId];
        if (player) {
            player.model.position.mapId = data.mapId;
            player.model.position.x = data.x;
            player.model.position.y = data.y;
        }
    };
    /**
     * 指定座標を中心とする半径rの円内に含まれるMobを返す
     * @param {model.Position} targetPos
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    EntitiesStore.prototype.getMobsByRadius = function (targetPos, r) {
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, this.getMobs());
    };
    /**
     * 指定座標を中心とする半径rの円内に含まれるPlayerを返す
     * @param {model.Position} targetPos
     * @param {number} r
     * @return {Array.<ctrl.Entity>}
     */
    EntitiesStore.prototype.getPlayersByRadius = function (targetPos, r) {
        var players = this.getPlayersByMapId(targetPos.mapId);
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, players);
    };
    /**
     * @param {Position} targetPos
     * @param {number} r
     * @param {MobCtrl[]} entities
     * @return {Array.<ctrl.Entity>}
     */
    EntitiesStore.prototype.getEntitiesStoreByRadiusInternal_ = function (targetPos, r, entities) {
        var result = [];
        var r2 = Math.pow(r, 2);
        _.forEach(entities, function (entity) {
            var px = entity.model.position.x - targetPos.x;
            var py = entity.model.position.y - targetPos.y;
            var entDist = Math.pow(px, 2) + Math.pow(py, 2);
            if (r2 >= entDist) {
                result.push(entity);
            }
        });
        return result;
    };
    return EntitiesStore;
})();
module.exports = EntitiesStore;
//# sourceMappingURL=entities.js.map