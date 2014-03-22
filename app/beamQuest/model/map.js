var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * @constructor
 * @extends {model.Model}
 */
var MapModel = function(opt_data) {
    Model.apply(this, arguments);

    /** @type {number} */
    this.id = this.data.id;

    /** @type {string} */
    this.name = this.data.name || MapModel.DEFAULT_NAME;

    /**
     * tmx ファイル
     * @type {null|*}
     */
    this.tmxObj = this.data.tmxObj || null;

    /**
     * マップサイズ
     * @type {Object.<width:number, height: number>}
     */
    this.size = this.data.size || MapModel.DEFAULT_SIZE;
};
util.inherits(MapModel, Model);

MapModel.DEFAULT_NAME = 'map';
MapModel.DEFAULT_SIZE = {width: 100, height: 100};

/** @override */
MapModel.prototype.toJSON = function() {
    var json = MapModel.super_.prototype.toJSON.apply(this);
    json.id = this.id;
    json.name = this.name;
    return json;
};

module.exports = MapModel;