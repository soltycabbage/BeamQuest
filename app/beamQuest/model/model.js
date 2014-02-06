var util = require('util'),
    ScheduleTarget = require('beamQuest/scheduleTarget');

/**
 * model全般の基底クラス
 * @param {Object=} opt_data
 * @constructor
 * @extends {bq.ScheduleTarget}
 */
var Model = function(opt_data) {
    ScheduleTarget.apply(this, arguments);
    this.data = opt_data || {};
};
util.inherits(Model, ScheduleTarget);

Model.prototype.toJSON = function() {
    return {};
};

module.exports = Model;