/**
 * マップ関係
 */
bq.SuperCollisionDetector = cc.Class.extend({
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
        var layer = this.tileMap.getLayer('background');
        // こういう感じでチェック if ( layer.getTileFlagsAt(pos) ==  0 ) { ; }
        return true;
    }
});