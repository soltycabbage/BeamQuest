/**
 * @fileoverview ドロップアイテム
 */

bq.object.DropItem = bq.object.Object.extend({
    prefixPath_: s_PrefixDropItem,
    /**
     * @param {bq.model.DropItem} model
     */
    ctor: function(model) {
        this._super(this.prefixPath_ + model.itemId + '.png');
        this.model_ = model;
        this.init_();
    },

    /**
     * @private
     */
    init_: function() {
        var pos = this.model_.position;
        this.setPosition(cc.p(pos.x, pos.y));
        if (this.model_.item.type === bq.Types.ItemType.MONEY) {
            this.showName(this.model_.num + this.model_.item.name);
        } else {
            this.showName(this.model_.item.name);
        }
    },

    /**
     * アイテム名を表示する
     * @param {string} name
     */
    showName: function(name) {
        var label = bq.Label.createWithShadow(name, 8, cc.c3b(20,240,255));
        label.setPosition(cc.p(0, -10));
        this.addChild(label);
    }
});