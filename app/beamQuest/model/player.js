var util = require('util'),
    Entity = require('beamQuest/model/entity');

/**
 * @constructor
 */
var Player = function() {
    Entity.apply(this, arguments);
    this.hp = Player.DEFAULT_HP;
    this.bp = Player.DEFAULT_BP;
    this.socket;
};
util.inherits(Player, Entity);

Player.DEFAULT_HP = 100;
Player.DEFAULT_BP = 10;


module.exports = Player;