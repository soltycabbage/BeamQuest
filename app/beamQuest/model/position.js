var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * 位置情報
 * @param {Object=} opt_data
 * @constructor
 */
var Position = function(opt_data) {
    Model.apply(this, arguments);

    /** @type {number} */
    this.mapId = opt_data.mapId || 1;

    /** @type {number} */
    this.x = opt_data.x || 0;

    /** @type {number} */
    this.y = opt_data.y || 0;
};
util.inherits(Position, Model);

/** @override */
Position.prototype.toJSON = function() {
    var json = Position.super_.prototype.toJSON.apply(this);
    json.mapId =  this.mapId;
    json.x =  this.x;
    json.y = this.y;
    return json;
};

module.exports = Position;