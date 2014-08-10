/// <reference path="../../typings/underscore/underscore.d.ts" />

import ScheduleTarget = require('beamQuest/scheduleTarget');

/**
 * ループ毎に処理を行うクラスを管理するクラス
 */
class Scheduler {
    private static instance_:Scheduler;
    private targets_: ScheduleTarget[];

    constructor() {
        if (Scheduler.instance_){
            throw new Error("Error: Instantiation failed: Use Scheduler.getInstance() instead of new.");
        }
        Scheduler.instance_ = this;

        this.targets_ = [];
    }

    public static getInstance():Scheduler
    {
        if(Scheduler.instance_ === undefined) {
            Scheduler.instance_ = new Scheduler();
        }
        return Scheduler.instance_;
    }

    /**
     * クラスをスケジューラーに登録する
     */
    add(target: ScheduleTarget) {
        this.targets_.push(target);
    }

    /**
     * クラスをスケジューラーから削除する
     */
    remove(target: ScheduleTarget) {
        this.targets_ = _.reject(this.targets_, function(element) { return element === target; });
    }

    /**
     * スケジューラーに登録されたクラスが持つupdate()メソッドを順次呼んでいく
     */
    update() : void {
        _.each(this.targets_, function(target) {
            target.update();
        });
    }
}

export = Scheduler;
