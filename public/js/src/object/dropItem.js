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
    }
});