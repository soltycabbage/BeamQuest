var mapStore = require('beamQuest/store/maps'),
    deferred = require('deferred');


/**
 * ゲーム内のEntityの状態を保持しておくクラス
 * @constructor
 */
var Entities = function() {
    /**
     * マップごとのプレイヤー一覧
     * @typedef {
     *    mapId: {
     *       userId: ctrl.Player
     *    }
     * }
     * @private
     */
    this.mapPlayers_ = {};

    /**
     * マップごとのmob一覧
     * @type {Object}
     * @private
     */
    this.mapMobs_ = {};

    /**
     * マップごとのnpc一覧
     * @type {Object}
     * @private
     */
    this.mapNpcs_ = {};

    this.entityListener_ = require('beamQuest/listener/entity');
};

/**
 * @return {deferred.promise}
 */
Entities.prototype.init = function() {
    var d = deferred();
    _.each(mapStore.getMaps(), function(map) {
        this.mapPlayers_[map.model.id] = {};
        this.mapMobs_[map.model.id] = {};
        this.mapNpcs_[map.model.id] = {};

    }.bind(this));
    return d.resolve();
};

/**
 * @param {number} mapId
 * @param {ctrl.Player} player
 */
Entities.prototype.addPlayer = function(mapId, player) {
    var players = this.mapPlayers_[mapId] || [],
        isAdd = !_.contains(players, player.model.id);

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
Entities.prototype.getPlayerById = function(mapId, playerId) {
    if (this.mapPlayers_[mapId]) {
        return this.mapPlayers_[mapId][playerId] || null;
    }
};

/**
 * @param {number} mapId
 * @param {ctrl.Player} player
 */
Entities.prototype.removePlayer = function(mapId, player) {
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
Entities.prototype.addMob = function(map, mob) {
    var mobs = this.mapMobs_[map.id] || [];
    if (!_.contains(mobs, mob.model.id)) {
        mobs[mob.model.id] = mob;
        map.mobCount++;
        this.entityListener_.popMob(mob);
    }
};

/**
 * @param {ctrl.Mob} mob
 */
Entities.prototype.removeMob = function(mob) {
    var map = mapStore.getMapById(mob.model.position.mapId);
    if (map) {
        map.model.mobCount--;
        delete this.mapMobs_[map.model.id][mob.model.id];
        mob.dispose();
    }
};

/**
 * @return {Object}
 */
Entities.prototype.getMobs = function() {
    return this.mapMobs_;
};

/**
 * @param {number mapId
 * @param {string} mobId
 * @return {ctrl.Mob}
 */
Entities.prototype.getMobById = function(mapId, mobId) {
    if (this.mapMobs_[mapId]) {
        return this.mapMobs_[mapId][mobId] || null;
    }
};

/**
 * @param {number} mapId
 * @return {Object}
 */
Entities.prototype.getPlayersJSON = function(mapId) {
    var json = {};
    var players = this.mapPlayers_[mapId] || [];
    _.each(players, function(player, key) {
        json[key] = player.model.toJSON();
    });
    return json;
};


/**
 * @param {number} mapId
 * @return {Object}
 */
Entities.prototype.getMobsJSON = function(mapId) {
    var json = {};
    var mobs = this.mapMobs_[mapId] || [];
    _.each(mobs, function(mob, key) {
        json[key] = mob.model.toJSON();
    });
    return json;
};

/**
 * @param {Object.{userId, mapId, x, y}} data
 */
Entities.prototype.updatePlayerPosition = function(data) {
    var player = this.mapPlayers_[data.mapId][data.userId];
    if (player) {
        player.model.position.mapId = data.mapId;
        player.model.position.x = data.x;
        player.model.position.y = data.y;
    }
};

var instance_ = new Entities();

module.exports = instance_;