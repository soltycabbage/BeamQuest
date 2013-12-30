/**
 * ゲーム内のEntityの状態を保持しておくクラス
 * @constructor
 */
var Entities = function() {
    /**
     * ログインしているプレイヤー一覧
     * @type {Object.<model.Player>}
     */
    this.players = {};

};

/**
 * @param {model.Player} player
 */
Entities.prototype.addPlayer = function(player) {
    if (!_.contains(this.players, player.id)) {
        this.players[player.id] = player;
    }
};

var instance_ = new Entities();

module.exports.getInstance = instance_;