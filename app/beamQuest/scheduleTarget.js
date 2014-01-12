/**
 * メインループで実行されるクラスはこいつを継承する
 * @constructor
 */
bq.ScheduleTarget = function() {
    this.scheduler_ = require('beamQuest/scheduler');
};

bq.ScheduleTarget.prototype.scheduleUpdate = function() {
    this.scheduler_.add(this);
};

bq.ScheduleTarget.prototype.update = function() {
    // 継承先でoverrideしてね
};

module.exports = bq.ScheduleTarget;