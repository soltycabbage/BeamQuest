var mapStore = require('beamQuest/store/maps');


/**
 * ゲーム内のEntityの状態を保持しておくクラス
 * @constructor
 */
var Entities = function() {
    /**
     * マップごとのプレイヤー一覧
     * @typedef {
     *    mapId: {
     *       userId: model.Player
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
    this.init_();
};

/**
 * @private
 */
Entities.prototype.init_ = function() {
    _.each(mapStore.getMaps(), function(map) {
        this.mapPlayers_[map.id] = {};
        this.mapMobs_[map.id] = {};
        this.mapNpcs_[map.id] = {};

    }.bind(this));
};

/**
 * @param {number} mapId
 * @param {model.Player} player
 */
Entities.prototype.addPlayer = function(mapId, player) {
    var players = this.mapPlayers_[mapId] || [],
        isAdd = !_.contains(players, player.id);

    if (isAdd) {
        players[player.id] = player;
    }
    logger.info('player add [mapId=' + mapId + ',playerId=' + player.id + ',isAdd=' + isAdd + ']');
};

/**
 * @param {number} mapId
 * @param {string} playerId
 * @return {model.Player}
 */
Entities.prototype.getPlayerById = function(mapId, playerId) {
    if (this.mapPlayers_[mapId]) {
        return this.mapPlayers_[mapId][playerId] || null;
    }
};

/**
 * @param {number} mapId
 * @param {model.Player} player
 */
Entities.prototype.removePlayer = function(mapId, player) {
    var players = this.mapPlayers_[mapId] || [];

    if (players[player.id]) {
        delete players[player.id];
        logger.info('player remove [mapId=' + mapId + ',playerId=' + player.id + ']');
    } else {
        logger.warn('cannot remove player [mapId=' + mapId + ',playerId=' + player.id + ']');
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
 * @param {model.Map} map
 * @param {ctrl.Mob} mob
 */
Entities.prototype.removeMob = function(map, mob) {
    if (map && mob) {
        map.mobCount--;
        delete this.mapMobs_[map.id][mob.model.id];
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
       json[key] = player.toJSON();
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
        player.position.mapId = data.mapId;
        player.position.x = data.x;
        player.position.y = data.y;
    }
};

/**
 * @param {number} mapId
 * @param {model.Mob} ステータスを更新したmob
 */
Entities.prototype.updateMobStatus = function(mapId, mob) {
    var target = this.mapMobs_[mapId][mob.model.id];
    if (target) {
        target = mob;
        if (target.model.hp < 0) { // 死
            this.entityListener_.killMob(mob);
            this.removeMob(mapStore.getMapById(mapId), mob);
        }
    }
};

var instance_ = new Entities();

module.exports = instance_;