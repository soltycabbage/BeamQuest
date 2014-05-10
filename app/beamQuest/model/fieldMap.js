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

    /**
     *  マップに存在するドロップアイテム (key: dropId)
     * @type {Object.<model.DropItem>}
     */
    this.dropItems = this.data.dropItems || {};
};
util.inherits(FieldMap, MapModel);

/**
 * @param {Array.<model.DropItem>} items
 */
FieldMap.prototype.addDropItems = function(items) {
    _.forEach(items, function(item) {
        this.dropItems[item.dropId] = item;
    }.bind(this));
};

/** @override */
FieldMap.prototype.toJSON = function() {
    var json = FieldMap.super_.prototype.toJSON.apply(this);
    json.maxMobCount = this.maxMobCount;
    json.mobCount = this.mobCount;
    json.dropItems = this.toObjectJSON(this.dropItems);
    return json;
};


module.exports = FieldMap;
