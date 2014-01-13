/**
 * @fileoverview Entityの状態が変化した時などなどを扱う
 */

var Entity = function() {
};

Entity.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;
    this.entitiesStore_ = require('beamQuest/store/entities');
};

/**
 * mobがPOPするよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.popMob = function(mob) {
    if (this.io_) {
        var data = {mob: mob.model.toJSON()};
        this.io_.sockets.emit('notify:entity:mob:pop', data);
    }
};

/**
 * mobが動いたよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.moveMob = function(mob) {
    if (this.io_) {
        this.io_.sockets.emit('notify:entity:mob:move', {mob: mob.model.toJSON()});
    }
};

/**
 * Mob殺すよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.kill = function(mob) {
    var data = {entity: mob.model.toJSON()};
    this.io_.sockets.emit('notify:entity:kill', data);
    _.each(mob.hateList, function(hate) {
        this.addExp(hate.entityId, mob);
    }.bind(this));
};

/**
 * mobのもつ経験値をplayerに与える
 * @param {string} playerId
 * @param {ctrl.Mob} mob
 */
Entity.prototype.addExp = function(playerId, mob) {
    var mapId = mob.model.position.mapId;
    var player = this.entitiesStore_.getPlayerById(mapId, playerId);
    if (player) {
        player.exp += mob.model.exp;
        player.socket.emit('user:status:exp:update', {exp: mob.model.exp});
    }        
};


var instance_ = new Entity();
module.exports = instance_;