var util = require('util'),
    events = require('events');

/**
 * model全般の基底クラス
 * @constructor
 */
var Model = function() {

};
util.inherits(Model, events.EventEmitter)

Model.prototype.create = function() {
    return new Model();
};

module.exports = Model;