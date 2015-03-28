/// <reference path="../../../typings/deferred/deferred.d.ts" />
var EntityListener = require('beamQuest/listener/entity');
var MapStore = require('beamQuest/store/maps');

var deferred = require('deferred');

/**
* ゲーム内のEntityの状態を保持しておくクラス
*/
var EntitiesStore = (function () {
    function EntitiesStore() {
        if (EntitiesStore.instance_) {
            throw new Error("Error: Instantiation failed: Use EntitiesStore.getInstance() instead of new.");
        }
        EntitiesStore.instance_ = this;

        this.mapPlayers_ = {};
        this.mapMobs_ = {};
        this.mapNpcs_ = {};
    }
    EntitiesStore.getInstance = function () {
        if (EntitiesStore.instance_ === undefined) {
            EntitiesStore.instance_ = new EntitiesStore();
        }
        return EntitiesStore.instance_;
    };

    /**
    * @return {deferred.promise}
    */
    EntitiesStore.prototype.init = function () {
        var _this = this;
        var d = deferred();
        _.each(MapStore.getInstance().getMaps(), function (map) {
            _this.mapPlayers_[map.model.id] = {};
            _this.mapMobs_[map.model.id] = {};
            _this.mapNpcs_[map.model.id] = {};
        });
        return d.resolve();
    };

    /**
    * @param {number} mapId
    * @param {ctrl.Player} player
    */
    EntitiesStore.prototype.addPlayer = function (mapId, player) {
        var players = this.mapPlayers_[mapId] || [], isAdd = !_.contains(players, player.model.id);

        if (isAdd) {
            players[player.model.id] = player;
        }
        logger.info('player add [mapId=' + mapId + ',playerId=' + player.model.id + ',isAdd=' + isAdd + ']');
    };

    /**
    * @param {number} mapId
    * @param {string} playerId
    * @return {ctrl.Player}
    */
    EntitiesStore.prototype.getPlayerById = function (mapId, playerId) {
        if (this.mapPlayers_[mapId]) {
            return this.mapPlayers_[mapId][playerId] || null;
        }
        return null;
    };

    /**
    * @return {Object}
    */
    EntitiesStore.prototype.getPlayers = function () {
        return this.mapPlayers_;
    };

    /**
    * @param {number} mapId
    * @return {Array.<ctrl.Player>}
    */
    EntitiesStore.prototype.getPlayersByMapId = function (mapId) {
        return this.mapPlayers_[mapId];
    };

    /**
    * @param {number} mapId
    * @param {ctrl.Player} player
    */
    EntitiesStore.prototype.removePlayer = function (mapId, player) {
        var players = this.mapPlayers_[mapId] || [];

        if (players[player.model.id]) {
            delete players[player.model.id];
            logger.info('player remove [mapId=' + mapId + ',playerId=' + player.model.id + ']');
        } else {
            logger.warn('cannot remove player [mapId=' + mapId + ',playerId=' + player.model.id + ']');
        }
    };

    /**
    * @param {model.Map} map
    * @param {ctrl.Mob} mob
    */
    EntitiesStore.prototype.addMob = function (map, mob) {
        var mobs = this.mapMobs_[map.id] || [];
        if (!_.contains(mobs, mob.model.id)) {
            mobs[mob.model.id] = mob;
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
    * @return {Object}
    */
    EntitiesStore.prototype.getMobs = function () {
        return this.mapMobs_;
    };

    /**
    * @param {number} mapId
    * @return {Array.<ctrl.Mob>}
    */
    EntitiesStore.prototype.getMobsByMapId = function (mapId) {
        return this.mapMobs_[mapId];
    };

    /**
    * @param {number mapId
    * @param {string} mobId
    * @return {ctrl.Mob}
    */
    EntitiesStore.prototype.getMobById = function (mapId, mobId) {
        if (this.mapMobs_[mapId]) {
            return this.mapMobs_[mapId][mobId] || null;
        }
        return null;
    };

    /**
    * @param {number} mapId
    * @return {Object}
    */
    EntitiesStore.prototype.getPlayersJSON = function (mapId) {
        var json = {};
        var players = this.mapPlayers_[mapId] || [];
        _.each(players, function (player, key) {
            json[key] = player.model.toJSON();
        });
        return json;
    };

    /**
    * @param {number} mapId
    * @return {Object}
    */
    EntitiesStore.prototype.getMobsJSON = function (mapId) {
        var json = {};
        var mobs = this.mapMobs_[mapId] || [];
        _.each(mobs, function (mob, key) {
            json[key] = mob.model.toJSON();
        });
        return json;
    };

    /**
    * @param {Object.{userId, mapId, x, y}} data
    */
    EntitiesStore.prototype.updatePlayerPosition = function (data) {
        var player = this.getPlayerById(data.mapId, data.userId);
        if (player) {
            player.model.position.mapId = data.mapId;
            player.model.position.x = data.x;
            player.model.position.y = data.y;
        }
    };

    /**
    * 回避行動中かどうかの状態を更新する
    */
    EntitiesStore.prototype.updatePlayerDouge = function (data) {
        var player = this.getPlayerById(data.mapId, data.userId);
        if (player) {
            player.model.setDouge(true);
            return true;
        }
        return false;
    };

    /**
    * 指定座標を中心とする半径rの円内に含まれるMobを返す
    * @param {model.Position} targetPos
    * @param {number} r
    * @return {Array.<ctrl.Entity>}
    */
    EntitiesStore.prototype.getMobsByRadius = function (targetPos, r) {
        var mobs = this.getMobsByMapId(targetPos.mapId);
        return this.getEntitiesStoreByRadiusInternal_(targetPos, r, mobs);
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
    * @param {Array.<ctrl.Entity>} entities
    * @param {number} r
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
