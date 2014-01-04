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
 * Entity殺すよってクライアントに伝える
 * @param {model.Entity} entity
 */
Entity.prototype.kill = function(entity) {
    var data = {entity: entity.toJSON()};
    this.io_.sockets.emit('notify:entity:kill', data);
};


var instance_ = new Entity();
module.exports = instance_;