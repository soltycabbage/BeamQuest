/**
 * @fileoverview プレイヤー、mob、NPC、全てのキャラクターの基底クラス
 */

var Entity = cc.Sprite.extend({
    name: 'entity', // entityの名前
    ctor: function(fileName, rect) {
        this._super();
        this.initWithFile(fileName, rect);
    },

    /**
     * entityの頭らへんに吹き出しを出す
     * @param {string} msg
     */
    showMessage: function(msg) {
        console.log(this.name + ' says: ' + msg);
        var tt = cc.LabelTTF.create(msg);
        tt.setPosition(cc.p(0, 50));
        this.addChild(tt);
    }
});