var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapModel = require('beamQuest/model/map');

var FieldMap = (function (_super) {
    __extends(FieldMap, _super);
    function FieldMap(opt_data) {
        _super.call(this, opt_data);

        this.maxMobCount = this.data.maxMobCount || 0;
        this.mobCount = this.data.mobCount || 0;
        this.dropItems = this.data.dropItems || {};
    }
    FieldMap.prototype.addDropItems = function (items) {
        var _this = this;
        _.forEach(items, function (item) {
            _this.dropItems[item.dropId] = item;
        });
    };

    FieldMap.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.maxMobCount = this.maxMobCount;
        json.mobCount = this.mobCount;
        json.dropItems = this.toObjectJSON(this.dropItems);
        return json;
    };
    return FieldMap;
})(MapModel);

module.exports = FieldMap;
//# sourceMappingURL=fieldMap.js.map
