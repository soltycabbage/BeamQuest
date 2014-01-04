/**
 * @fileOverview リアルタイム進行するmobのPOPとかの処理を書いてく
 */
var entitiesStore = require('beamQuest/store/entities'),
    mapStore = require('beamQuest/store/maps'),
    mobModel = require('beamQuest/model/mob'),
    positionModel = require('beamQuest/model/position');

var Mob = function() {
};

Mob.prototype.run = function() {
    this.initMobs_();
};

Mob.prototype.initMobs_ = function() {
    _.each(mapStore.getMaps(), function(map) {
        this.spawnMob_(map);
    }.bind(this));
};

Mob.prototype.spawnMob_ = function(map) {
    for(var i = 0;i < map.maxMobCount; i++) {
        // TODO: mapごとに出現モンスターとか決める
        var position = this.randomPosition_(map);
        var mob = new mobModel({
            id: 'mob_kamuraro_' + map.id + '_' + i,
            name: 'カム太郎',
            position: position
        });
        entitiesStore.addMob(map.id, mob);
    }
};

/**
 * @param {model.Map}
 * @return {model.Position}
 * @private
 */
Mob.prototype.randomPosition_ = function(map) {
    var randX = Math.floor(Math.random() * map.size.width);
    var randY = Math.floor(Math.random() * map.size.height);
    var position = new positionModel({
        mapId: map.id,
        x: randX,
        y: randY
    });
    return position;
};

// TODO: map.mobCount が一定数以下にならないように定期的にPOPさせる

var instance_ = new Mob();
module.exports = instance_;