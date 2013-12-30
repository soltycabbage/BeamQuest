var util = require('util'),
    Entity = require('beamQuest/model/entity');

/**
 * @constructor
 * @extends {model.Entity}
 */
var Player = function(opt_data) {
    Entity.apply(this, arguments);

    /** @type {number} */
    this.hp = opt_data.hp || Player.DEFAULT_HP;

    /** @type {number} */
    this.bp = opt_data.bp || Player.DEFAULT_BP;

    /** @type {Socket} */
    this.socket = opt_data.socket || null;
};
util.inherits(Player, Entity);

Player.DEFAULT_HP = 100;
Player.DEFAULT_BP = 10;

/** @override */
Player.prototype.toJSON = function() {
    var json = Player.super_.prototype.toJSON.apply(this);
    json.hp =  this.hp;
    json.bp = this.bp;
    return json;
};

module.exports = Player;