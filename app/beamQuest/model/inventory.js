var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');

/**
* インベントリのmodel
*/
var Inventory = (function (_super) {
    __extends(Inventory, _super);
    function Inventory(opt_data) {
        _super.call(this, opt_data);

        this.items = this.data.items || {};
        this.money = this.data.money || 0;
    }
    /**
    * アイテムを取り出す
    * @param itemId
    */
    Inventory.prototype.pushItem = function (itemId) {
        if (!this.items[itemId]) {
            this.items[itemId] = { 'amount': 1 };
        } else {
            this.items[itemId].amount++;
        }
    };

    /**
    * アイテムを取り出す
    * @param itemId
    * @returns {?string}
    */
    Inventory.prototype.pickItem = function (itemId) {
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

    Inventory.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.items = this.items;
        json.mony = this.money;
        return json;
    };
    return Inventory;
})(Model);

module.exports = Inventory;
//# sourceMappingURL=inventory.js.map
