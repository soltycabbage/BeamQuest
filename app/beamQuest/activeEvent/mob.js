/**
 * @fileOverview リアルタイム進行するmobのPOPとかの処理を書いてく
 */
var entitiesStore = require('beamQuest/store/entities'),
    mapStore = require('beamQuest/store/maps'),
    mobModel = require('beamQuest/model/mob'),
    positionModel = require('beamQuest/model/position');

var Mob = function() {
};

Mob.POP_INTERVAL = 15000;

Mob.prototype.run = function() {
    this.initMobs_();
    setInterval(this.initMobs_.bind(this), Mob.POP_INTERVAL);
};

/**
 * マップごとにmobを配置していく
 * @private
 */
Mob.prototype.initMobs_ = function() {
    _.each(mapStore.getMaps(), function(map) {
        this.spawnMob_(map);
    }.bind(this));
};

/**
 * Mapに決められたmobの最大数になるまでmobをpopさせる
 * @param {model.Map} map
 * @private
 */
Mob.prototype.spawnMob_ = function(map) {
    var timeStamp = parseInt(new Date().getTime()/1);
    for(var i = map.mobCount;i < map.maxMobCount; i++) {
        // TODO: mapごとに出現モンスターとか決める
        var position = this.randomPosition_(map);
        var mobType = bq.Params.Entities.KAMUTARO;
        var mob = new mobModel({
            id: mobType.id + '_' + map.id + '_' + i + '_' + timeStamp,
            name: mobType.name,
            hp: mobType.hp,
            exp: mobType.exp,
            position: position
        });
        entitiesStore.addMob(map, mob);
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