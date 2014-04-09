var util = require('util'),
    Model = require('beamQuest/model/model'),
    PositionModel = require('beamQuest/model/position');
/**
 * ドロップアイテムのmodel
 * @constructor
 * @extends {model.Model}
 */
var DropItem = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * ドロップアイテムごとに付けられるユニークID
     * @type {string}
     */
    this.dropId = this.data.dropId;

    /**
     * ドロップしたアイテムのID
     * @type {bq.Types.Items}
     */
    this.itemId = this.data.itemId;

    /**
     * 個数
     * @type {number}
     */
    this.num = this.data.num;

    /**
     * ドロップしたEntityのID
     * @type {string}
     */
    this.dropperId = this.data.dropperId;

    /**
     * ドロップした時刻 (unix time [msec])
     * @type {number}
     */
    this.droppedAt = this.data.droppedAt;

    /**
     * ドロップした座標
     * @type {mode.Position}
     */
    this.position = this.data.position || new PositionModel();
};
util.inherits(DropItem, Model);

/**
 * @param {model.Position} position
 */
DropItem.prototype.setPosition = function(position) {
    this.position = position;
};

/** @override */
DropItem.prototype.toJSON = function() {
    var json = {};
    json.dropId = this.dropId;
    json.itemId = this.itemId;
    json.num = this.num;
    json.dropperId = this.dropperId;
    json.droppedAt = this.droppedAt;
    json.position = this.position.toJSON();
    return json;
};

module.exports = DropItem;