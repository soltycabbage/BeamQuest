import Model = require('./model');

/**
 * アイテムのmodel
 */
class Item extends Model {
    /** @var アイテムの名前 */
    name: string;

    /** @var アイテムの説明文 */
    info: string;

    /** @var アイテムのタイプ  @type {bq.Types.ItemType} */
    type: any;

    constructor(opt_data) {
        super(opt_data);

        this.name = this.data.name || 'item';
        this.info = this.data.info || '';
        this.type = this.data.type;
    }

    toJSON(): any {
        var json = super.toJSON();
        json.name = this.name;
        json.info = this.info;
        json.type = this.type;
        return json;
    }
}

export = Item;
