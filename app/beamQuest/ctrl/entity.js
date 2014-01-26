var util = require('util'),
    EntityModel = require('beamQuest/model/entity'),
    ScheduleTarget = require('beamQuest/scheduleTarget'),
    entityListener = require('beamQuest/listener/entity');

/**
 * すべてのmob、playerの基底クラス。
 * HPの増減、ステータス異常、死亡処理など敵味方関係のない共通の処理はここに書く
 * @constructor
 * @param {Object} modelData
 * @extends {bq.ScheduleTarget}
 */
var Entity = function(modelData) {
    ScheduleTarget.apply(this, arguments);
};
util.inherits(Entity, ScheduleTarget);

/**
 * ctrlをnewしたあとは必ずこれを呼んでmodel(各種ステータスとか)をセットすること
 * @param {model.Entity} model
 */
Entity.prototype.setModel = function(model) {
    this.model = model;
};

/**
 * 現在HPを増減する
 */
Entity.prototype.updateHp = function(amount) {
    var expectHp = this.model.hp + amount;
    if (expectHp > this.model.maxHp) {
        this.model.hp = this.model.maxHp;
    } else if (expectHp <= 0) { // HP0以下
        this.model.hp = 0;
    } else {
        this.model.hp = expectHp;
    }
    entityListener.updateHp([{entity: this.model, hpAmount: amount}]);

    if (this.model.hp <= 0) {
        this.death();
    }
};

/**
 * 死亡フラグ
 * @protected
 */
Entity.prototype.death = function() {
    // playerとかmobとかでoverrideする
};

module.exports = Entity;