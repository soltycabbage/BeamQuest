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
 * @param {string} userId
 */
Entities.prototype.removePlayerById = function(userId) {

};

var instance_ = new Entities();

module.exports = instance_;