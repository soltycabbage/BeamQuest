var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');

/**
* アイテムのmodel
*/
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(opt_data) {
        _super.call(this, opt_data);

        this.name = this.data.name || 'item';
        this.info = this.data.info || '';
        this.type = this.data.type;
    }
    Item.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.name = this.name;
        json.info = this.info;
        json.type = this.type;
        return json;
    };
    return Item;
})(Model);

module.exports = Item;
//# sourceMappingURL=item.js.map
