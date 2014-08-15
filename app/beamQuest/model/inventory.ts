import Model = require('beamQuest/model/model');

/**
 * インベントリのmodel
 */
class Inventory extends Model {
    /** 所持品 */
    items: Object;

    /** 所持金 */
    money: number;

    constructor(opt_data) {
        super(opt_data);

        this.items = this.data.items || {};
        this.money = this.data.money || 0;
    }

    /**
     * アイテムを取り出す
     * @param itemId
     */
    pushItem(itemId: string): void {
        if (!this.items[itemId]) {
            this.items[itemId] = {'amount': 1};
        } else {
            this.items[itemId].amount++;
        }
    }

    /**
     * アイテムを取り出す
     * @param itemId
     * @returns {?string}
     */
    pickItem(itemId: string): any {
        if (!this.items[itemId]) {
            return null;
        } else {
            this.items[itemId].amount--;
            if (this.items[itemId].amount <= 0) {
                delete this.items[itemId];
            }
            return itemId;
        }
    }

    toJSON() : any{
        var json = super.toJSON();
        json.items = this.items;
        json.mony = this.money;
        return json;
    }
}

export = Inventory;
