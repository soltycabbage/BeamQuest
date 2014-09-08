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

        this.mapPlayers_ = [];
        this.mapMobs_ = [];
        this.mapNpcs_ = {};
    }
    EntitiesStore.getInstance = function () {
        if (EntitiesStore.instance_ === undefined) {
            EntitiesStore.instance_ = new EntitiesStore();
        }
        return EntitiesStore.instance_;
    };

    EntitiesStore.prototype.init = function () {
        this.mapPlayers_ = [];
        this.mapMobs_ = [];
        this.mapNpcs_ = [];
    };

    /**
    * @param {ctrl.Player} player
    */
    EntitiesStore.prototype.addPlayer = function (player) {
        var isAdd = !_.contains(this.mapPlayers_, player.model.id);

        if (isAdd) {
            this.mapPlayers_[player.model.id] = player;
        }
        logger.info('player add [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
    };

    /**
    * @param {string} playerId
    * @return {ctrl.Player}
    */
    EntitiesStore.prototype.getPlayerById = function (playerId) {
        return this.mapPlayers_[playerId] || null;
    };

    /**
    * @return PlayerCtrl[]
    */
    EntitiesStore.prototype.getPlayers = function () {
        return this.mapPlayers_;
    };

    /**
    * @param {number} mapId
    * @return {PlayerCtrl[]}
    */
    EntitiesStore.prototype.getPlayersByMapId = function (mapId) {
        return _.filter(this.mapPlayers_, function (player) {
            return player.model.mapId === mapId;
        });
    };

    /**
    * @param {ctrl.Player} player
    */
    EntitiesStore.prototype.removePlayer = function (player) {
        if (this.mapPlayers_[player.model.id]) {
            delete this.mapPlayers_[player.model.id];
            logger.info('player remove [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        } else {
            logger.warn('cannot remove player [mapId=' + player.model.position.mapId + ',playerId=' + player.model.id + ']');
        }
    };

    /**
    * @param {model.Map} map
    * @param {ctrl.Mob} mob
    */
    EntitiesStore.prototype.addMob = function (map, mob) {
        if (!_.contains(this.mapMobs_, mob.model.id)) {
            this.mapMobs_[mob.model.id] = mob;
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
            delete this.mapMobs_[map.model.id][mob.model.id];
            mob.dispose();
        }
    };

    /**
    * @return {MobCtrl[]}
    */
    EntitiesStore.prototype.getMobs = function () {
        return this.mapMobs_;
    };

    /**
    * @param {string} mobId
    * @return {ctrl.Mob}
    */
    EntitiesStore.prototype.getMobById = function (mobId) {
        return this.mapMobs_[mobId] || null;
    };

    /**
    * @return {Object}
    */
    EntitiesStore.prototype.getPlayersJSON = function () {
        var json = {};
        _.each(this.mapPlayers_, function (player, key) {
            json[key] = player.model.toJSON();
        });
        return json;
    };

    /**
    * @return {Object}
    */
    EntitiesStore.prototype.getMobsJSON = function () {
        var json = {};
        _.each(this.mapMobs_, function (mob, key) {
            json[key] = mob.model.toJSON();
        });
        return json;
    };

    /**
    * @param {Object.{userId, mapId, x, y}} data
    */
    EntitiesStore.prototype.updatePlayerPosition = function (data) {
        var player = this.mapPlayers_[data.userId];
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
