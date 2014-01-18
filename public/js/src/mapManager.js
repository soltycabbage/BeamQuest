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
        var layer = this.tileMap.getLayer('background');
        var gid = layer.getTileGIDAt(cc.p(Math.floor(pos.x/32), Math.floor((1600-pos.y)/32)));


        var tileProperties = this.mapInfo.getTileProperties()[gid];
        // cc.log(pos.x + " " + pos.y + " " +  gid + " " + tileProperties);

        return  ! ( tileProperties && tileProperties['not_enterable'] === "true");
    }
});