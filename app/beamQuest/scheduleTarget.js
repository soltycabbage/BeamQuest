var Scheduler = require('beamQuest/scheduler');
/**
 * メインループで実行されるクラスはこいつを継承する
 */
var ScheduleTarget = (function () {
    function ScheduleTarget() {
        this.scheduler = Scheduler.getInstance();
    }
    /**
     * ループ毎にスケジューラにupdate()を実行させたい場合はこれを呼ぶ
     */
    ScheduleTarget.prototype.scheduleUpdate = function () {
        this.scheduler.add(this);
    };
    /**
     * 登録したupdate()スケジュールを削除したい場合はこれを呼ぶ
     */
    ScheduleTarget.prototype.unscheduleUpdate = function () {
        this.scheduler.remove(this);
    };
    /**
     * 毎ループ実行される
     * @protected
     */
    ScheduleTarget.prototype.update = function () {
        // 継承先でoverrideしてね
    };
    return ScheduleTarget;
})();
module.exports = ScheduleTarget;
//# sourceMappingURL=scheduleTarget.js.map