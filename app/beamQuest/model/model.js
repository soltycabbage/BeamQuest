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

/** @protected */
Model.prototype.toJSON = function() {
    return {};
};

/**
 * Objectに入った各modelをtoJSON()して返す
 * @param {Object.<Model>} obj
 * @return {Object.<Object>}
 * @protected
 */
Model.prototype.toObjectJSON = function(obj) {
    var result = {};
    _.forEach(obj, function(value, key) {
        result[key] = value.toJSON();
    });
    return result;
};

/**
 * 配列に入った各modelをtoJSON()して返す
 * @param {Array.<Model>} arr
 * @return {Array.<Object>}
 * @protected
 */
Model.prototype.toArrayJSON = function(arr) {
    var result = [];
    _.forEach(arr, function(model) {
        result.push(model.toJSON());
    });
    return result;
};

module.exports = Model;
