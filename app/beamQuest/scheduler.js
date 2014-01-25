/**
 * ループ毎に処理を行うクラスを管理するクラス
 * @constructor
 */
bq.Scheduler = function() {
    /**
     * @type {Array.<bq.ScheduleTarget>}
     * @private
     */
    this.targets_ = [];
};

/**
 * クラスをスケジューラーに登録する
 * @param {bq.ScheduleTarget} target
 */
bq.Scheduler.prototype.add = function(target) {
    this.targets_.push(target);
};

/**
 * クラスをスケジューラーから削除する
 * @param {bq.ScheduleTarget} target
 */
bq.Scheduler.prototype.remove = function(target) {
    this.targets_ = _.reject(this.targets_, function(element) { return element === target });
};

/**
 * スケジューラーに登録されたクラスが持つupdate()メソッドを順次呼んでいく
 */
bq.Scheduler.prototype.update = function() {
    _.each(this.targets_, function(target) {
        target.update();
    });
};

var instance_ = new bq.Scheduler();
module.exports = instance_;
