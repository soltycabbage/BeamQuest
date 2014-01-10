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
 * @param {model.Mob} mob
 */
Entity.prototype.popMob = function(mob) {
    if (this.io_) {
        var data = {mob: mob.toJSON()};
        this.io_.sockets.emit('notify:entity:mob:pop', data);
    }
};

/**
 * Entity殺すよってクライアントに伝える
 * @param {model.Entity} entity
 */
Entity.prototype.kill = function(entity) {
    var data = {entity: entity.toJSON()};
    this.io_.sockets.emit('notify:entity:kill', data);
    _.each(entity.hateList, function(playerId) {
        this.addExp(playerId, entity);
    }.bind(this));
};

/**
 * entityのもつ経験値をplayerに与える
 * @param {string} playerId
 * @param {model.Entity} entity
 */
Entity.prototype.addExp = function(playerId, entity) {
    var mapId = entity.position.mapId;
    var player = this.entitiesStore_.getPlayerById(mapId, playerId);
    if (player) {
        player.exp += entity.exp;
        player.socket.emit('user:status:exp:update', {exp: entity.exp});
    }        
};


var instance_ = new Entity();
module.exports = instance_;