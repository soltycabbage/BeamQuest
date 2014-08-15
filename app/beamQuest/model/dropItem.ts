import Model = require('beamQuest/model/model');
import PositionModel = require('beamQuest/model/position');
import ItemModel = require('beamQuest/model/item');

declare var bq: any;

/**
 * ドロップ情報のmodel
 */
class DropItem extends Model {
    /** ドロップしたアイテムのID @type {bq.Types.Items} */
    itemId: any;
    /** アイテム情報 @type {model.Item} */
    item: ItemModel;
    /** 個数  */
    num: number;
    /** ドロップさせたEntityのID */
    dropperId: number;
    /** ドロップした時刻 (unix time [msec]) */
    droppedAt: number;
    /** ドロップした座標 */
    position: PositionModel;
    /** ドロップアイテムごとに付けられるユニークID  */
    dropId: string;
    constructor(opt_data) {
        super(opt_data);

        this.itemId = this.data.itemId;
        this.item = this.data.item;
        var item = bq.params.Items[this.itemId];
        if (!this.item && item) {
            this.item = new ItemModel(item);
        }
        this.num = this.data.num;
        this.dropperId = this.data.dropperId;
        this.droppedAt = this.data.droppedAt;
        this.position = this.data.position || new PositionModel(null);
        this.dropId = this.data.dropId || this.generateDropId();
    }

    private generateDropId(): string {
        // テキトーな乱数をくっつけて同時期にドロップしたアイテム同士のID重複を防ぐ
        var r = Math.floor(Math.random() * 1000000);
        return [this.itemId, this.dropperId, this.droppedAt, r].join('_');
    }

    setPosition(position: PositionModel): void {
        this.position = position;
    }

    toJSON() {
        var json = super.toJSON();
        json.dropId = this.dropId;
        json.itemId = this.itemId;
        json.item = this.item.toJSON();
        json.num = this.num;
        json.dropperId = this.dropperId;
        json.droppedAt = this.droppedAt;
        json.position = this.position.toJSON();
        return json;
    }
}

export = DropItem;
