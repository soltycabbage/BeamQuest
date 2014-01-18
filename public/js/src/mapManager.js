/**
 * マップ関係
 */
bq.MapManager = cc.Class.extend({
    /**
     *
     * @param {cc.TMXTiledMap} tileMap
     */
    ctor:function (tileMap, tmxFile) {
        'use strict';
        this.tileMap = tileMap;
        this.mapInfo = cc.TMXMapInfo.create(tmxFile);
    },

    /**
     * マップ上のx,y(グローバル座標）に移動できるか？！？！
     * @param {cc.p} pos
     * @returns {boolean}
     */
    canMoveOnMap:function (pos) {
        // TODO 入れないレイヤが決め打ちなので、レイヤーにno_enterableのプロパティがあったらとかにする
        var layers = [this.tileMap.getLayer('noentry'), this.tileMap.getLayer('river')];
        var sizeY = this.tileMap.getTileSize().width * this.tileMap.getMapSize().width;
        // すべてのレイヤーになにもなかったら入れる
        return _.all(layers, function(layer) {
            var gid = layer.getTileGIDAt(cc.p(Math.floor(pos.x/32), Math.floor((sizeY-pos.y)/32)));
            // cc.log(pos.x + " " + pos.y + " " +  gid + " " );
            return !gid;
        } );

    }
});