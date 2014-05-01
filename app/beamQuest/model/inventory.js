var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * インベントリのmodel
 * @constructor
 * @extends {model.Model}
 */
var Inventory = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * 所持品
     * @type {Object}
     */
    this.items = this.data.items || {};

    /**
     * 所持金
     * @type {number}
     */
    this.money = this.data.money || 0;
};
util.inherits(Inventory, Model);

/**
 * アイテムを加える
 * @param {string} itemId
 */
Inventory.prototype.pushItem = function(itemId) {
    if (!this.items[itemId]) {
        this.items[itemId] = {'amount': 1};
    } else {
        this.items[itemId].amount++;
    }
};

/**
 * アイテムを取り出す
 * @param {string} itemId
 * @return {?string} アイテムID
 */
Inventory.prototype.pickItem = function(itemId) {
    if (!this.items[itemId]) {
        return null;
    } else {
        this.items[itemId].amount--;
        if (this.items[itemId].amount <= 0) {
            delete this.items[itemId];
        }
        return itemId;
    }
};

/** @override */
Inventory.prototype.toJSON = function() {
    var json = {};
    json.items = this.items;
    json.mony = this.money;
    return json;
};

module.exports = Inventory;