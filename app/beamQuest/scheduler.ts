/// <reference path="../../typings/underscore/underscore.d.ts" />

import ScheduleTarget = require('beamQuest/scheduleTarget');

/**
 * ループ毎に処理を行うクラスを管理するクラス
 */
var targets_: ScheduleTarget[] = [];

/**
 * クラスをスケジューラーに登録する
 */
export function add(target: ScheduleTarget) {
    targets_.push(target);
}

/**
 * クラスをスケジューラーから削除する
 */
export function remove(target: ScheduleTarget) {
    targets_ = _.reject(targets_, function(element) { return element === target; });
}

/**
 * スケジューラーに登録されたクラスが持つupdate()メソッドを順次呼んでいく
 */
export function update() : void {
    _.each(targets_, function(target) {
        target.update();
    });
}
