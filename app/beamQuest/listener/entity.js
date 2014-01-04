/**
 * @fileoverview Entityの状態が変化した時などなどを扱う
 */

var Entity = function() {
};

Entity.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;
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
};


var instance_ = new Entity();
module.exports = instance_;