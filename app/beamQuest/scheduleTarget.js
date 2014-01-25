/**
 * メインループで実行されるクラスはこいつを継承する
 * @constructor
 */
bq.ScheduleTarget = function() {
    this.scheduler_ = require('beamQuest/scheduler');
};

/**
 * ループ毎にスケジューラにupdate()を実行させたい場合はこれを呼ぶ
 */
bq.ScheduleTarget.prototype.scheduleUpdate = function() {
    this.scheduler_.add(this);
};

/**
 * 登録したupdate()スケジュールを削除したい場合はこれを呼ぶ
 */
bq.ScheduleTarget.prototype.unscheduleUpdate = function() {
    this.scheduler_.remove(this);
};

/**
 * 毎ループ実行される
 * @protected
 */
bq.ScheduleTarget.prototype.update = function() {
    // 継承先でoverrideしてね
};

module.exports = bq.ScheduleTarget;
