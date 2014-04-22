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
    },

    /**
     * 当たり判定の範囲を矩形で返す
     * @return {cc.rect}
     */
    getCollideRect: function() {
        // 見た目と同じ当たり判定。Objectのサイズが32x32なら当たり判定の範囲も32x32
        var a = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
    }
});