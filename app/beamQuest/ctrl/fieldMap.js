var util = require('util'),
    MobModel = require('beamQuest/model/mob'),
    positionModel = require('beamQuest/model/position'),
    entitiesStore = require('beamQuest/store/entities'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    MobCtrl = require('beamQuest/ctrl/mob/mob');

var FieldMap = function(map) {
    EntityCtrl.apply(this, arguments);
    this.scheduleUpdate();

    this.map = map;
};
util.inherits(FieldMap, EntityCtrl);

FieldMap.POP_INTERVAL = 15000;

/** @override */
FieldMap.prototype.update = function() {
    this.initMobs_();
    setInterval(this.initMobs_.bind(this), FieldMap.POP_INTERVAL);
};

/**
 * マップごとにmobを配置していく
 * @private
 */
FieldMap.prototype.initMobs_ = function() {
    this.spawnMob_();
};

/**
 * Mapに決められたmobの最大数になるまでmobをpopさせる
 * @param {model.Map} map
 * @private
 */
FieldMap.prototype.spawnMob_ = function() {
    var timeStamp = parseInt(new Date().getTime()/1);
    for(var i = this.map.mobCount;i < this.map.maxMobCount; i++) {
        // TODO: mapごとに出現モンスターとか決める
        var position = this.randomPosition_();
        var mobType = bq.Params.Entities.KAMUTARO;
        var mob = new MobCtrl();
        var mobModel = new MobModel({
            id: mobType.id + '_' + this.map.id + '_' + i + '_' + timeStamp,
            name: mobType.name,
            hp: mobType.hp,
            exp: mobType.exp,
            position: position
        });
        mob.setModel(mobModel);
        mob.startPos = _.clone(position);
        entitiesStore.addMob(this.map, mob);
    }
};

/**
 * @param {model.Map}
 * @return {model.Position}
 * @private
 */
FieldMap.prototype.randomPosition_ = function() {
    var randX = Math.floor(Math.random() * this.map.size.width);
    var randY = Math.floor(Math.random() * this.map.size.height);
    var position = new positionModel({
        mapId: this.map.id,
        x: randX,
        y: randY
    });
    return position;
};

module.exports = FieldMap;