var util = require('util'),
    MobModel = require('beamQuest/model/mob'),
    positionModel = require('beamQuest/model/position'),
    entitiesStore = require('beamQuest/store/entities'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    MobCtrl = require('beamQuest/ctrl/mob/mob');

var FieldMap = function(map) {
    EntityCtrl.apply(this, arguments);
    this.scheduleUpdate();

    this.model = map;

    entitiesStore = require('beamQuest/store/entities');

    setInterval(this.spawnMob_.bind(this), FieldMap.POP_INTERVAL);
};
util.inherits(FieldMap, EntityCtrl);

FieldMap.POP_INTERVAL = 15000;

/** @override */
FieldMap.prototype.update = function() {
    // ここに毎ループの処理を書いてくよ
};

/**
 * マップごとにmobを配置していく
 * @private
 */
FieldMap.prototype.initMobs = function() {
    this.spawnMob_();
};

/**
 * Mapに決められたmobの最大数になるまでmobをpopさせる
 * @param {model.Map} map
 * @private
 */
FieldMap.prototype.spawnMob_ = function() {
    var timeStamp = parseInt(new Date().getTime()/1);
    for(var i = this.model.mobCount;i < this.model.maxMobCount; i++) {
        // TODO: mapごとに出現モンスターとか決める
        var position = this.randomPosition_();
        var mobType = bq.params.Entities.KAMUTARO;
        var mob = new MobCtrl();
        var mobModel = new MobModel(mobType);
        mobModel.setId(mobType.id + '_' + this.model.id + '_' + i + '_' + timeStamp);
        mobModel.setPosition(position);
        mob.setModel(mobModel);
        mob.startPos = _.clone(position);
        entitiesStore.addMob(this.model, mob);
    }
};

/**
 * @param {model.Map}
 * @return {model.Position}
 * @private
 */
FieldMap.prototype.randomPosition_ = function() {
    var randX = Math.floor(Math.random() * this.model.size.width);
    var randY = Math.floor(Math.random() * this.model.size.height);
    var position = new positionModel({
        mapId: this.model.id,
        x: randX,
        y: randY
    });
    return position;
};

/**
 * @param {Array.<model.DropItem>} items
 */
FieldMap.prototype.addDropItems = function(items) {
    this.model.addDropItems(items);
};

module.exports = FieldMap;
