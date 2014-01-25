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
     * tmx ファイル
     * @type {null|*}
     */
    this.tmxObj = this.data.tmxObj || null;

    /**
     * マップサイズ
     * @type {Object.<width:number, height: number>}
     */
    this.size = this.data.size || Map.DEFAULT_SIZE;
};
util.inherits(Map, Model);

Map.DEFAULT_NAME = 'map';
Map.DEFAULT_SIZE = {width: 100, height: 100};

/** @override */
Map.prototype.toJSON = function() {
    var json = Map.super_.prototype.toJSON.apply(this);
    json.id = this.id;
    json.name = this.name;
    return json;
};

module.exports = Map;