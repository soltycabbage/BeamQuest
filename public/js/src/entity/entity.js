/**
 * @fileoverview プレイヤー、mob、NPC、全てのキャラクターの基底クラス
 */
bq.entity = {};

/**
 * @constructor
 * @extends {cc.Sprite}
 */
bq.entity.Entity = cc.Sprite.extend({
    DEFULT_NAME: 'entity',
    name: 'entity', // entityの名前
    chatRect: null, // チャット吹き出しのSprite

    /**
     * @param {string} spriteFrameName *.plistの<key>に設定されてるframeName
     */
    ctor: function(spriteFrameName) {
        this._super();
        var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrameName);
        spriteFrame && this.initWithSpriteFrame(spriteFrame);
        this.init_();
    },

    /**
     * @private
     */
    init_: function() {
        if (this.DEFULT_NAME !== this.name) {
            this.showName(this.name, true);
        }
    },

    /**
     * Entityの頭上にキャラ名を表示する
     */
    showName: function() {
        var size = this.getBoundingBox().size;
        var label = bq.Label.createWithShadow(this.name);

        label.setPosition(cc.p(size.width / 2, size.height + 3));
        this.addChild(label);
    },

    /**
     * entityの頭らへんに吹き出しを出す
     * @param {string} msg
     */
    showMessage: function(msg) {
        this.removeChatRect_(this.chatRect);
        var size = this.getBoundingBox().size;

        // 吹き出し
        var msgRect = cc.Sprite.create();
        msgRect.setTextureRect(cc.rect(0, 0, msg.length * 12 + 20, 20));
        msgRect.setColor(cc.c3b(0, 0, 0));
        msgRect.setOpacity(200);
        msgRect.setPosition(cc.p(size.width / 2, size.height + 30));

        // label
        var tt = bq.Label.create(msg);
        tt.setPosition(cc.p(msgRect.getBoundingBox().size.width / 2, 10));

        // 吹き出しのしっぽみたいなやつ
        var tail = cc.Sprite.create(s_ChatTail);
        tail.setColor(cc.c3b(0, 0, 0));
        tail.setOpacity(200);
        tail.setPosition(cc.p(msgRect.getBoundingBox().size.width / 2, -3));

        msgRect.addChild(tt);
        msgRect.addChild(tail, -100);
        this.addChild(msgRect, bq.config.tags.CHAT);
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