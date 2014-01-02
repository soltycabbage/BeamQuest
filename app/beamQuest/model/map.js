var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * @constructor
 * @extends {model.Model}
 */
var Map = function(opt_data) {
    Model.apply(this, arguments);

    /** @type {number} */
    this.id = this.data.id;

    /** @type {string} */
    this.name = this.data.name || Map.DEFAULT_NAME;

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
util.inherits(Map, Model);

Map.DEFAULT_NAME = 'map';

/** @override */
Map.prototype.toJSON = function() {
    var json = Map.super_.prototype.toJSON.apply(this);
    json.id = this.id;
    json.name = this.name;
    json.maxMobCount = this.maxMobCount;
    json.mobCount = this.mobCount;
    return json;
};

module.exports = Map;