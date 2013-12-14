/**
 * @fileoverview プレイヤー、mob、NPC、全てのキャラクターの基底クラス
 */

var Entity = cc.Sprite.extend({
    name: 'entity', // entityの名前
    chatRect: null, // チャット吹き出しのSprite
    ctor: function(fileName, rect) {
        this._super();
        this.initWithFile(fileName, rect);
    },

    /**
     * entityの頭らへんに吹き出しを出す
     * @param {string} msg
     */
    showMessage: function(msg) {
        this.removeChatRect_();

        // 吹き出し
        var msgRect = cc.Sprite.create();
        msgRect.setTextureRect(cc.rect(0, 0, msg.length * 12 + 20, 25));
        msgRect.setColor(cc.c3b(0, 0, 0));
        msgRect.setOpacity(150);
        msgRect.setPosition(cc.p(15, 50));

        // label
        var tt = cc.LabelTTF.create(msg, 'pixelMplus', 12);
        tt.setPosition(cc.p(msgRect.getBoundingBox().size.width / 2, 10));

        msgRect.addChild(tt);
        this.addChild(msgRect);
        this.chatRect = msgRect;
        setTimeout($.proxy(this.removeChatRect_, this), 5000);
    },

    /**
     * チャットの吹き出しを消す
     * @private
     */
    removeChatRect_: function() {
        if (this.chatRect) {
            this.removeChild(this.chatRect);
            this.chatRect = null;
        }
    }
});