var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScheduleTarget = require('beamQuest/scheduleTarget');
var EntityListener = require('beamQuest/listener/entity');

/**
* すべてのmob、playerの基底クラス。
* HPの増減、ステータス異常、死亡処理など敵味方関係のない共通の処理はここに書く
* @constructor
* @param {Object} modelData
* @extends {bq.ScheduleTarget}
*/
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity() {
        _super.apply(this, arguments);
    }
    /**
    * ctrlをnewしたあとは必ずこれを呼んでmodel(各種ステータスとか)をセットすること
    * @param {model.Entity} model
    */
    Entity.prototype.setModel = function (model) {
        this.model = model;

        this.model.on('addHp', _.bind(this.handleAddHp, this));
    };

    /**
    * @param {number} amount
    * @param {boolean} isCritical
    * @protected
    */
    Entity.prototype.handleAddHp = function (amount, isCritical) {
        var hpData = [
            { entity: this.model, hpAmount: amount, isCritical: isCritical }
        ];
        EntityListener.getInstance().updateHp(hpData);
        if (this.model.hp <= 0) {
            this.death();
        }
    };

    /**
    * 死亡フラグ
    * @protected
    */
    Entity.prototype.death = function () {
        // playerとかmobとかでoverrideする
    };
    return Entity;
})(ScheduleTarget);

module.exports = Entity;
//# sourceMappingURL=entity.js.map
