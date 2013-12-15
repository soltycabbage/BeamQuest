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
        this.removeChatRect_(this.chatRect);

        // 吹き出し
        var msgRect = cc.Sprite.create();
        msgRect.setTextureRect(cc.rect(0, 0, msg.length * 12 + 20, 20));
        msgRect.setColor(cc.c3b(0, 0, 0));
        msgRect.setOpacity(200);
        msgRect.setPosition(cc.p(15, 50));

        // label
        var tt = bq.Label.create(msg);
        tt.setPosition(cc.p(msgRect.getBoundingBox().size.width / 2, 8));

        // 吹き出しのしっぽみたいなやつ
        var tail = cc.Sprite.create(s_ChatTail);
        tail.setColor(cc.c3b(0, 0, 0));
        tail.setOpacity(200);
        tail.setPosition(cc.p(msgRect.getBoundingBox().size.width / 2, -3));

        msgRect.addChild(tt);
        msgRect.addChild(tail, -100);
        this.addChild(msgRect);
        this.chatRect = msgRect;
        setTimeout($.proxy(this.removeChatRect_, this, msgRect), 5000);
    },

    /**
     * チャットの吹き出しを消す
     * @param {cc.Sprite} msgRect
     * @private
     */
    removeChatRect_: function(msgRect) {
        if (this.chatRect === msgRect) {
            this.removeChild(this.chatRect);
            this.chatRect = null;
        }
    }
});