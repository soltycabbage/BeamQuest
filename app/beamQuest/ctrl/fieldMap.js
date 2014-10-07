var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MobModel = require('beamQuest/model/mob');
var PositionModel = require('beamQuest/model/position');
var EntitiesStore = require('beamQuest/store/entities');
var EntityCtrl = require('beamQuest/ctrl/entity');
var MobCtrl = require('beamQuest/ctrl/mob/mob');
var FieldMap = (function (_super) {
    __extends(FieldMap, _super);
    function FieldMap(map) {
        _super.call(this);
        /**
         * @param {Array.<model.DropItem>} items
         */
        this.addDropItems = function (items) {
            this.model.addDropItems(items);
        };
        this.scheduleUpdate();
        this.model = map;
        setInterval(this.spawnMob_.bind(this), FieldMap.POP_INTERVAL);
    }
    FieldMap.prototype.update = function () {
        // ここに毎ループの処理を書いてくよ
    };
    /**
     * マップごとにmobを配置していく
     */
    FieldMap.prototype.initMobs = function () {
        this.spawnMob_();
    };
    /**
     * Mapに決められたmobの最大数になるまでmobをpopさせる
     * @param {model.Map} map
     * @private
     */
    FieldMap.prototype.spawnMob_ = function () {
        var timeStamp = new Date().getTime() / 1;
        for (var i = this.model.mobCount; i < this.model.maxMobCount; i++) {
            // TODO: mapごとに出現モンスターとか決める
            var position = this.randomPosition_();
            var mobType = bq.params.Entities.KAMUTARO;
            var mob = new MobCtrl();
            var mobModel = new MobModel(mobType);
            mobModel.setId(mobType.id + '_' + this.model.id + '_' + i + '_' + timeStamp);
            mobModel.setPosition(position);
            mob.setModel(mobModel);
            mob.startPos = _.clone(position);
            EntitiesStore.getInstance().addMob(this.model, mob);
        }
    };
    /**
     * @param {model.Map}
     * @return {model.Position}
     */
    FieldMap.prototype.randomPosition_ = function () {
        var randX = Math.floor(Math.random() * this.model.size.width);
        var randY = Math.floor(Math.random() * this.model.size.height);
        var position = new PositionModel({
            mapId: this.model.id,
            x: randX,
            y: randY
        });
        return position;
    };
    FieldMap.POP_INTERVAL = 15000;
    return FieldMap;
})(EntityCtrl);
module.exports = FieldMap;
//# sourceMappingURL=fieldMap.js.map