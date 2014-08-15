var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');
var PositionModel = require('beamQuest/model/position');
var ItemModel = require('beamQuest/model/item');

/**
* ドロップ情報のmodel
*/
var DropItem = (function (_super) {
    __extends(DropItem, _super);
    function DropItem(opt_data) {
        _super.call(this, opt_data);

        this.itemId = this.data.itemId;
        this.item = this.data.item;
        var item = bq.params.Items[this.itemId];
        if (!this.item && item) {
            this.item = new ItemModel(item);
        }
        this.num = this.data.num;
        this.dropperId = this.data.dropperId;
        this.droppedAt = this.data.droppedAt;
        this.position = this.data.position || new PositionModel(null);
        this.dropId = this.data.dropId || this.generateDropId();
    }
    DropItem.prototype.generateDropId = function () {
        // テキトーな乱数をくっつけて同時期にドロップしたアイテム同士のID重複を防ぐ
        var r = Math.floor(Math.random() * 1000000);
        return [this.itemId, this.dropperId, this.droppedAt, r].join('_');
    };

    DropItem.prototype.setPosition = function (position) {
        this.position = position;
    };

    DropItem.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.dropId = this.dropId;
        json.itemId = this.itemId;
        json.item = this.item.toJSON();
        json.num = this.num;
        json.dropperId = this.dropperId;
        json.droppedAt = this.droppedAt;
        json.position = this.position.toJSON();
        return json;
    };
    return DropItem;
})(Model);

module.exports = DropItem;
//# sourceMappingURL=dropItem.js.map
