/**
 * マップ関係
 */
bq.MapManager = cc.Class.extend({
    /**
     *
     * @param {cc.TMXTiledMap} tileMap
     */
    ctor:function (tileMap) {
        'use strict';
        this.tileMap = tileMap;
    },

    /**
     * マップ上のx,y(グローバル座標）に移動できるか？！？！
     * @param {cc.p} pos
     * @returns {boolean}
     */
    canMoveOnMap:function (pos) {
        // レイヤーにno_enterableのプロパティがあったらそれは入れないレイヤー
        var layers = _.select(this.tileMap.getChildren(), function(layer) {
            return  (layer && layer.getProperties()['no_enterable'] === 'true')
        } );

        var sizeY = this.tileMap.getTileSize().width * this.tileMap.getMapSize().width;
        // すべてのレイヤーになにもなかったら入れる
        return _.all(layers, function(layer) {
            var gid = layer.getTileGIDAt(cc.p(Math.floor(pos.x/32), Math.floor((sizeY-pos.y)/32)));
            // cc.log(pos.x + " " + pos.y + " " +  gid + " " );
            return !gid;
        } );

    }
});