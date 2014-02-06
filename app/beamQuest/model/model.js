var util = require('util'),
    events = require('events');

/**
 * model全般の基底クラス
 * @param {Object=} opt_data
 * @constructor
 * @extends {events.EventEmitter}
 */
var Model = function(opt_data) {
    this.data = opt_data || {};
};
util.inherits(Model, events.EventEmitter);

Model.prototype.toJSON = function() {
    return {};
};

module.exports = Model;