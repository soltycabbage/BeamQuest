var util = require('util'),
    Model = require('beamQuest/model/model'),
    PositionModel = require('beamQuest/model/position'),
    ItemModel = require('beamQuest/model/item');

/**
 * ドロップ情報のmodel
 * @constructor
 * @extends {model.Model}
 */
var DropItem = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * ドロップしたアイテムのID
     * @type {bq.Types.Items}
     */
    this.itemId = this.data.itemId;

    /**
     * アイテム情報
     * @type {model.Item}
     */
    this.item = this.data.item;
    var item = bq.params.Items[this.itemId];
    if (!this.item && item) {
        this.item = new ItemModel(item);
    }

    /**
     * 個数
     * @type {number}
     */
    this.num = this.data.num;

    /**
     * ドロップさせたEntityのID
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

    /**
     * ドロップアイテムごとに付けられるユニークID
     * @type {string}
     */
    this.dropId = this.data.dropId || this.generateDropId_();
};
util.inherits(DropItem, Model);

/**
 * @private
 */
DropItem.prototype.generateDropId_ = function() {
    // テキトーな乱数をくっつけて同時期にドロップしたアイテム同士のID重複を防ぐ
    var r = Math.floor(Math.random() * 1000000);
    return [this.itemId, this.dropperId, this.droppedAt, r].join('_');
};

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
    json.item = this.item.toJSON();
    json.num = this.num;
    json.dropperId = this.dropperId;
    json.droppedAt = this.droppedAt;
    json.position = this.position.toJSON();
    return json;
};

module.exports = DropItem;