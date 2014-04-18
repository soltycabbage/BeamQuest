var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * アイテムのmodel
 * @constructor
 * @extends {model.Model}
 */
var Item = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * アイテムの名前
     * @type {string}
     */
    this.name = this.data.name || 'item';

    /**
     * アイテムの説明文
     * @type {string}
     */
    this.info = this.data.info || '';

    /**
     * アイテムのタイプ
     * @type {bq.Types.ItemType}
     */
    this.type = this.data.type;
};
util.inherits(Item, Model);

/** @override */
Item.prototype.toJSON = function() {
    var json = {};
    json.name = this.name;
    json.info = this.info;
    json.type = this.type;
    return json;
};

module.exports = Item;