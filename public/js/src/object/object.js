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
     * @param {string} imgFile 該当画像までのファイルパス
     */
    ctor: function(imgFile) {
        this._super();
        this.initWithFile(imgFile);
    }
});