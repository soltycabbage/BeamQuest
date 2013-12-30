/**
 * ゲーム内のEntityの状態を保持しておくクラス
 * @constructor
 */
var Entities = function() {
    /**
     * ログインしているプレイヤー一覧
     * @type {Object.<model.Player>}
     * @private
     */
    this.players_ = {};
};

/**
 * @param {model.Player} player
 */
Entities.prototype.addPlayer = function(player) {
    if (!_.contains(this.players, player.id)) {
        this.players_[player.id] = player;
    }
};

/**
 * @return {Object.<model.Player>}
 */
Entities.prototype.getPlayers = function() {
    return this.players_;
};

/**
 * @return {Object}
 */
Entities.prototype.getPlayersJSON = function() {
    var json = {};
    _.each(this.players_, function(player, key) {
       json[key] = player.toJSON();
    });
    return json;
};

/**
 * @param {string} userId
 */
Entities.prototype.removePlayerById = function(userId) {
    this.players_ = _.reject(this.players_, function(player) {
        return player.id === userId;
    });
};

/**
 * @param {Object.{userId, mapId, x, y}} data
 */
Entities.prototype.updatePlayerPosition = function(data) {
    var player = this.players_[data.userId];
    if (player) {
        player.position.mapId = data.mapId;
        player.position.x = data.x;
        player.position.y = data.y;
    }
};

var instance_ = new Entities();

module.exports = instance_;