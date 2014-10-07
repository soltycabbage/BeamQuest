/// <reference path="../../typings/underscore/underscore.d.ts" />
/**
 * ループ毎に処理を行うクラスを管理するクラス
 */
var Scheduler = (function () {
    function Scheduler() {
        if (Scheduler.instance_) {
            throw new Error("Error: Instantiation failed: Use Scheduler.getInstance() instead of new.");
        }
        Scheduler.instance_ = this;
        this.targets_ = [];
    }
    Scheduler.getInstance = function () {
        if (Scheduler.instance_ === undefined) {
            Scheduler.instance_ = new Scheduler();
        }
        return Scheduler.instance_;
    };
    /**
     * クラスをスケジューラーに登録する
     */
    Scheduler.prototype.add = function (target) {
        this.targets_.push(target);
    };
    /**
     * クラスをスケジューラーから削除する
     */
    Scheduler.prototype.remove = function (target) {
        this.targets_ = _.reject(this.targets_, function (element) {
            return element === target;
        });
    };
    /**
     * スケジューラーに登録されたクラスが持つupdate()メソッドを順次呼んでいく
     */
    Scheduler.prototype.update = function () {
        _.each(this.targets_, function (target) {
            target.update();
        });
    };
    return Scheduler;
})();
module.exports = Scheduler;
//# sourceMappingURL=scheduler.js.map