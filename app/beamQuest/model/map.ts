import Model = require('./model');

class Size {
    width:number;
    height:number;
}

class MapModel extends Model {
    static DEFAULT_NAME = 'map';
    static DEFAULT_SIZE = {width: 100, height: 100};

    id: number;
    name: string;
    /**
     * tmx ファイル
     */
    tmxObj: any;

    /**
     * マップサイズ
     * @type {Object.<width:number, height: number>}
     */
    size: Size;

    constructor(opt_data) {
        super(opt_data);
        this.id = this.data.id;
        this.name = this.data.name || MapModel.DEFAULT_NAME;
        this.tmxObj = this.data.tmxObj || null;
        this.size = this.data.size || MapModel.DEFAULT_SIZE;
    }

    toJSON() : any {
        var json = super.toJSON();
        json.id = this.id;
        json.name = this.name;
        return json;
    }
}

export = MapModel;
