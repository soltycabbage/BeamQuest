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

        // ふわふわさせる
        var bezierTo = cc.RepeatForever.create(cc.BezierTo.create(1, [cc.p(pos.x, pos.y+10), cc.p(pos.x, pos.y-10), pos]));
        this.runAction(bezierTo);
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
     * @param {bq.model.Position} pos
     * @param {string} pickerId
     */
    pickAndRemove: function(pos, pickerId) {
        var moveTo = cc.MoveTo.create(0.2, cc.p(pos.x, pos.y));
        var fadeOut = cc.FadeOut.create(0.1);
        var removeFunc = cc.CallFunc.create($.proxy(this.removeFromParent, this));
        this.runAction(cc.Sequence.create(cc.Spawn.create(moveTo, fadeOut), removeFunc));
        if (pickerId === bq.player.name) {
            this.playSound_();
            this.addInstantMsg_();
        }
    },

    /**
     * 取得音を鳴らす
     * @private
     */
    playSound_: function() {
        if (this.model_.item.type === bq.Types.ItemType.MONEY) {
            bq.soundManager.playEffect(s_SeMoney);
        } else {
            bq.soundManager.playEffect(s_SePyu);
        }
    },

    /**
     * インスタントメッセージにログを残す
     * @private
     */
    addInstantMsg_: function() {
        var hud = bq.Hud.getInstance();
        var itemName = '<span style="color: cyan;">' + this.model_.item.name + '</span>'
        if (this.model_.item.type === bq.Types.ItemType.MONEY) {
            hud.addInstantMsg(this.model_.num + this.model_.item.name + 'を手に入れた！');
        } else if (this.model_.num > 1) {
            hud.addInstantMsg(itemName + ' を' + this.model_.num + 'つ手に入れた！');
        } else {
            hud.addInstantMsg(itemName + ' を手に入れた！');
        }
    },

    /**
     * アイテム名を表示する
     * @param {string} name
     */
    showName: function(name) {
        var fontSize = 3;
        var label = bq.Label.createWithShadow(name, fontSize, cc.color(160,255,255));
        label.setPosition(cc.p(name.length * fontSize, -10));

        this.addChild(label);
    }
});
