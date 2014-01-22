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
        // 画面外に出ようとしてたら問答無用でfalse
        if (pos.x < 0 || pos.y < 0) {
            return false;
        }

        // レイヤーにno_enterableのプロパティがあったらそれは入れないレイヤー
        var layers = _.select(this.tileMap.getChildren(), function(layer) {
            return  (layer && layer.getProperties()['no_enterable'] === 'true')
        } );

        var sizeY = this.tileMap.getTileSize().width * this.tileMap.getMapSize().width;
        // すべてのレイヤーになにもなかったら入れる
        var tileSize = bq.config.maps.TILE_SIZE;
        return _.all(layers, function(layer) {
            var gid = layer.getTileGIDAt(cc.p(Math.floor(pos.x/tileSize),
                Math.floor((sizeY-pos.y)/tileSize)));
            return !gid;
        } );

    },

    /**
     * このマップでのリスポーンポイントを返す
     *
     * @returns {cc.p}
     */
    getRespawnPoint: function() {
        var objGroup = this.tileMap.getObjectGroup('respawn');
        var respawnObj = objGroup && objGroup.objectNamed('respawn_point');
        if ( respawnObj ) {
            return cc.p(respawnObj.x, respawnObj.y);
        } else {
            // リスポーンポイントが指定されてない場合適当な場所
            return cc.p(100,100);
        }
    }
});