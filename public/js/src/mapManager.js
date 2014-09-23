/**
 * マップ関係
 * @class
 * @extends cc.Class
 */
bq.MapManager = cc.Class.extend({
    /**
     *
     * @param {cc.TMXTiledMap} tileMap
     */
    ctor:function (tileMap) {
        'use strict';
        this.tileMap = tileMap;

        /**
         * マップ上に落ちてるアイテム
         * @type {Object.<bq.object.DropItem>}
         * @private
         */
        this.dropItems_ = [];
    },

    /**
     * サーバからmapIdに指定したマップ上に存在するドロップアイテム一覧を取得してきて更新する
     * @param {number} mapId
     */
    updateDropItemsByMapId: function(mapId) {
        var soc = bq.Socket.getInstance();
        soc.requestDropItemsByMapId(mapId, $.proxy(function(data) {
            this.addDropItems(data['dropitems']);
        }, this));
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
            return  (layer instanceof cc.TMXLayer &&
                layer.getProperties()['no_enterable'] === 'true');
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
    },

    /**
     * マップ上にドロップアイテムを追加する
     * @param {Object.<Object>} itemJsons
     */
    addDropItems: function(itemJsons) {
        _.forEach(itemJsons, $.proxy(function(itemJson) {
            var item =  new bq.object.DropItem(new bq.model.DropItem(itemJson));
            bq.baseLayer.addChild(item, bq.config.zOrder.DROP_ITEM);
            this.dropItems_[itemJson['dropId']] = item;
        }), this);
    },

    /**
     * マップ上のドロップアイテムを削除する
     * @param {Object} itemJson
     */
    removeDropItem: function(itemJson) {
        if (this.dropItems_[itemJson['dropId']]) {
            var item = this.dropItems_[itemJson['dropId']];
            item.pickAndRemove(itemJson['pickerPosition'], itemJson['pickerId']);
            delete this.dropItems_[itemJson['dropId']];
        }
    }
});