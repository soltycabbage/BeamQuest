/**
 * @fileoverview プレイヤー、mob、NPC、全てのキャラクターの基底クラス
 */
bq.entity = {};

/**
 * @constructor
 * @extends {cc.Sprite}
 */
bq.entity.Entity = cc.Sprite.extend({
    DEFAULT_NAME: 'entity',
    name: 'entity', // entityの名前
    chatRect: null, // チャット吹き出しのSprite
    collideRect_: null, // 当たり判定の範囲
    currentState:null,
    currentDirection:null,

    /**
     * @param {string} spriteFrameName *.plistの<key>に設定されてるframeName
     */
    ctor: function(spriteFrameName, frameMap) {
        this._super();
        var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrameName);
        spriteFrame && this.initWithSpriteFrame(spriteFrame);
        if ( frameMap ) {
            this.animations = bq.entity.Animation.createAnimations(frameMap);
        }
        this.init_();
    },

    /**
     * @private
     */
    init_: function() {
        if (this.DEFAULT_NAME !== this.name) {
            this.showName(this.name, true);
        }
        var bbox = this.getBoundingBox();
        this.collideRect_ = cc.rect(0, 0, bbox.width, bbox.height);
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
     * @return {cc.rect}
     */
    getCollideRect: function() {
        return this.collideRect_;
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
    },


    /**
     *
     * @param {string} name
     * @param {string} direction
     * @returns {bq.Animate}
     */
    getAnimationByNameDirection: function(name, direction) {
        var key = name + "_" + direction;
        if ( this.animations[key] ) {
            return this.animations[key];
        } else {
            cc.log(key + "　is not found");
        }
     },

    /**
     * 向きと状態を更新してそれにもとづいてアニメーションを更新する
     * @param {bq.entity.EntityState.Direction} dir 向き
     * @param {bq.entity.EntityState.Mode} sts 状態
     */
    updateAnimation: function(state, direction){

        if ( state == null && direction == null ) {
            return;
        }
        if ( state == this.currentState && direction == this.currentDirection ) {
            return ;
        }
        state = state ? state : this.currentState;
        direction = direction ? direction : this.currentDirection;

        this.currentState = state;
        this.currentDirection = direction;

        var animation = this.getAnimationByNameDirection(state,direction);

        // すでにあるアニメーションを削除
        if ( this.getNumberOfRunningActions() > 0 ) {
            this.stopAllActions();
        }
        this.runAction(animation);
    },

    /**
     * @param {number} amount HP変化量
     * @param {number} opt_popLeft trueならダメージラベルが左に飛ぶよ
     */
    updateHp: function(amount, opt_popLeft) {
        if (amount < 0) { // ダメージ
            cc.AudioEngine.getInstance().playEffect(s_SeDamage);
            this.popDamageLabel_(amount, !!opt_popLeft);
        } else if (amount > 0) { // 回復
            // TODO
        } else { // ノーダメやで
            // TODO
        }
    },

    /**
     * @private
     */
    popDamageLabel_: function(amount, popLeft) {
        var damage = Math.abs(amount);
        var label = bq.Label.createWithShadow(damage, 20);
        var size = this.getBoundingBox();
        label.setPosition(cc.p(size.width/2, size.height));
        var d = popLeft ? -1 : 1;
        var action = cc.JumpTo.create(1.5, cc.p(d * 200, -100), 100, 1);
        var fadeOut = cc.FadeOut.create(1.5);
        this.addChild(label);
        label.runAction(cc.Sequence.create(cc.Spawn.create(action, fadeOut),
            cc.CallFunc.create(function() {
                label.removeFromParent();
            })));
    }
});