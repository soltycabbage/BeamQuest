var util = require('util'),
    MapModel = require('beamQuest/model/map');

var FieldMap = function(opt_data) {
    MapModel.apply(this, arguments);
    /**
     * マップ上に存在できるmobの最大値。mobCountがこの数以下になるとmobがPOPする
     * @type {number}
     */
    this.maxMobCount = this.data.maxMobCount || 0;

    /**
     * マップに存在するmobの数
     * @type {number}
     */
    this.mobCount = this.data.mobCount || 0;
};
util.inherits(FieldMap, MapModel);

FieldMap.prototype.toJSON = function() {
    var json = FieldMap.super_.prototype.toJSON.apply(this);
    json.maxMobCount = this.maxMobCount;
    json.mobCount = this.mobCount;
    return json;
};


module.exports = FieldMap;
