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
        this.schedule(this.collidePlayer_, 0.5);
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

    /** @override */
    getCollideRect: function() {
        // 見かけより2倍大きい当たり判定
        var a = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - a.width, p.y, a.width * 2, a.height * 2);
    },

    /**
     * プレイヤーとの衝突をチェックして衝突してたらpick扱いにする
     * @private
     */
    collidePlayer_: function() {
        if(cc.rectIntersectsRect(bq.player.getCollideRect(), this.getCollideRect())) {
            this.tryPick_();
        }
    },

    /**
     * pickを試みる
     * @private
     */
    tryPick_: function() {
        var soc = bq.Socket.getInstance();
        soc.requestPickItem(this.model_.dropId, this.model_.position.mapId, bq.player.name);
    },

    /**
     * @param {bq.model.Position}
     */
    pickAndRemove: function(pos) {
        var moveTo = cc.MoveTo.create(0.2, cc.p(pos.x, pos.y));
        var fadeOut = cc.FadeOut.create(0.1);
        var removeFunc = cc.CallFunc.create($.proxy(this.removeFromParent, this));
        this.runAction(cc.Sequence.create(cc.Spawn.create(moveTo, fadeOut), removeFunc));
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