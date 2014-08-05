/// <reference path="model.ts" />

import Model = require('beamQuest/model/model');

class MapModel extends Model {
    DEFAULT_NAME = 'map';
    DEFAULT_SIZE = {width: 100, height: 100};

    id: Number;
    name: string;
    /**
     * tmx ファイル
     */
    tmxObj: any;

    /**
     * マップサイズ
     * @type {Object.<width:number, height: number>}
     */
    size: Object

    constructor(opt_data) {
        super(opt_data);
        this.id = this.data.id;
        this.name = this.data.name || this.DEFAULT_NAME;
        this.tmxObj = this.data.tmxObj || null;
        this.size = this.data.size || this.DEFAULT_SIZE;
    }

    toJSON() : any {
        var json = super.toJSON();
        json.id = this.id;
        json.name = this.name;
        return json;
    }
}

export = MapModel;
