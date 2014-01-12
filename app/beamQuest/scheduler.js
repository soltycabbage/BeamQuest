bq.Scheduler = function() {
    /**
     * @type {Array.<bq.ScheduleTarget>}
     * @private
     */
    this.targets_ = [];
};

bq.Scheduler.prototype.add = function(target) {
    this.targets_.push(target);
};

bq.Scheduler.prototype.update = function() {
    _.each(this.targets_, function(target) {
        target.update();
    });
};

var instance_ = new bq.Scheduler();

module.exports = instance_;