var util = require('util'),
    EntityModel = require('beamQuest/model/entity'),
    ScheduleTarget = require('beamQuest/scheduleTarget');

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

module.exports = Entity;