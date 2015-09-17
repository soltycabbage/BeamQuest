import MapModel = require('./map');
import DropItem = require('./dropItem');

class FieldMap extends MapModel {
    /** マップ上に存在できるmobの最大値。mobCountがこの数以下になるとmobがPOPする */
    maxMobCount: number;
    /** マップに存在するmobの数  */
    mobCount: number;
    /** マップに存在するドロップアイテム (key: dropId) */
    dropItems: DropItem[];

    constructor(opt_data) {
        super(opt_data);

        this.maxMobCount = this.data.maxMobCount || 0;
        this.mobCount = this.data.mobCount || 0;
        this.dropItems = this.data.dropItems || {};
    }

    addDropItems(items: DropItem[]): void {
        _.forEach(items, (item) => {
            this.dropItems[item.dropId] = item;
        });
    }

    toJSON():any {
        var json = super.toJSON();
        json.maxMobCount = this.maxMobCount;
        json.mobCount = this.mobCount;
        json.dropItems = this.toObjectJSON(this.dropItems);
        return json;
    }
}

export = FieldMap;
