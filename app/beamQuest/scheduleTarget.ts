import Scheduler = require('./scheduler')

/**
 * メインループで実行されるクラスはこいつを継承する
 */
class ScheduleTarget {
    private scheduler;

    constructor() {
        this.scheduler = Scheduler.getInstance();
    }

    /**
     * ループ毎にスケジューラにupdate()を実行させたい場合はこれを呼ぶ
     */
    scheduleUpdate() {
        this.scheduler.add(this);
    }

    /**
     * 登録したupdate()スケジュールを削除したい場合はこれを呼ぶ
     */
    unscheduleUpdate() {
        this.scheduler.remove(this);
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
