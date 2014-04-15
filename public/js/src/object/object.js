/**
 * @fileoverview アイテム、移動可能オブジェクト等の基底クラス
 */
bq.object = {};

/**
 * @constructor
 * @extends {cc.Sprite}
 */
bq.object.Object = cc.Sprite.extend({
    /**
     * @param {string} spriteFrameName *.plistの<key>に設定されてるframeName
     */
    ctor: function(spriteFrameName) {
        this._super();
        //var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrameName);
        //spriteFrame && this.initWithSpriteFrame(spriteFrame);
    }
});