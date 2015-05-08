import Scheduler = require('beamQuest/scheduler')

/**
 * メインループで実行されるクラスはこいつを継承する
 */
class ScheduleTarget {

    constructor() {
    }

    /**
     * ループ毎にスケジューラにupdate()を実行させたい場合はこれを呼ぶ
     */
    scheduleUpdate() {
        Scheduler.add(this);
    }

    /**
     * 登録したupdate()スケジュールを削除したい場合はこれを呼ぶ
     */
    unscheduleUpdate() {
        Scheduler.remove(this);
    }

    /**
     * 毎ループ実行される
     * @protected
     */
    update() {
        // 継承先でoverrideしてね
    }

}

export = ScheduleTarget;
