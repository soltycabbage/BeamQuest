var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');

var MapModel = (function (_super) {
    __extends(MapModel, _super);
    function MapModel(opt_data) {
        _super.call(this, opt_data);
        this.id = this.data.id;
        this.name = this.data.name || MapModel.DEFAULT_NAME;
        this.tmxObj = this.data.tmxObj || null;
        this.size = this.data.size || MapModel.DEFAULT_SIZE;
    }
    MapModel.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.id = this.id;
        json.name = this.name;
        return json;
    };
    MapModel.DEFAULT_NAME = 'map';
    MapModel.DEFAULT_SIZE = { width: 100, height: 100 };
    return MapModel;
})(Model);

module.exports = MapModel;
//# sourceMappingURL=map.js.map
