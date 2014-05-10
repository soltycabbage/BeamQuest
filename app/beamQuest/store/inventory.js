var InventoryModel = require('beamQuest/model/inventory');

/**
 * 各プレイヤーの所持品を保持しておくクラス
 * @constructor
 */
var Inventory = function() {

    /**
     * こんな感じでアイテムを保持する
     {
         'karihei': {
             'items': {
                 '1':  {'amount': 10}, // アイテムIDと数量
                 '12': {'amount': 5},  // IDをキーにしてるのは検索しやすくするため。
                 '13': {'amount': 3}
             },
             'money': 10000 // ビーツ
         }
     };
     */
    this.inventory_ = {};
};

/**
 * アイテムを所持品に加える
 * @param {string} userId
 * @param {string} itemId
 */
Inventory.prototype.push = function(userId, itemId) {
    if (!this.inventory_[userId]) {
        this.inventory_[userId] = new InventoryModel();
    }

    this.inventory_[userId].pushItem(itemId);
};

/**
 * アイテムを所持品から取り出す
 * @param {string} userId
 * @param {string} itemId
 * @return {?string} アイテムID
 */
Inventory.prototype.pick = function(userId, itemId) {
    if (!this.inventory_[userId]) {
        return null;
    }

    return this.inventory_[userId].pickItem(itemId);
};
var instance_ = new Inventory();

module.exports = instance_;