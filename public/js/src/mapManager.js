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
     * @param {cc.Point} pos
     * @returns {boolean}
     */
    canMoveOnMap:function (pos) {
        var mapSizeX = this.tileMap.getTileSize().width * this.tileMap.getMapSize().width;
        var mapSizeY = this.tileMap.getTileSize().height * this.tileMap.getMapSize().height;

        // 画面外に出ようとしてたら問答無用でfalse
        if (pos.x < 0 || pos.y < 0 || pos.x > mapSizeX || pos.y > mapSizeY) {
            return false;
        }

        // レイヤーにno_enterableのプロパティがあったらそれは入れないレイヤー
        var layers = _.select(this.tileMap.getChildren(), function(layer) {
            return  (layer instanceof cc.TMXLayer &&
                layer.getProperties()['no_enterable'] === 'true');
        } );

        // すべてのレイヤーになにもなかったら入れる
        var tileSize = bq.config.maps.TILE_SIZE;
        return _.all(layers, function(layer) {
            var gid = layer.getTileGIDAt(cc.p(Math.floor(pos.x/tileSize),
                Math.floor((mapSizeY-pos.y)/tileSize)));
            return !gid;
        } );
    },

    /**
     * 引数fromからtoまでの線分上に侵入禁止エリアがかかっている場合、その手前の座標を返す
     * @param {cc.Point} from
     * @param {cc.Point} to
     */
    getNormalizePosByEnterable: function(from, to) {
        if (this.canMoveOnMap(to)) {
            return to;
        } else if (cc.pDistance(from, to) > 10) {
            // to, fromの単位ベクトル
            var v = cc.pNormalize(cc.pSub(to, from));
            return this.getNormalizePosByEnterable(from, cc.pSub(to, cc.pMult(v, 10)));
        }
        return from;
    },

    /**
     * 引数posがマップの範囲外の場合は範囲内に収まるようにposを調整/更新する
     * @param {cc.Point} pos
     * @retuen {cc.Point}
     */
    getNormalizePosByMapSize: function(pos) {
        var np = new cc.Point(0, 0);
        var mapSizeX = this.tileMap.getTileSize().width * this.tileMap.getMapSize().width;
        var mapSizeY = this.tileMap.getTileSize().height * this.tileMap.getMapSize().height;
        np.x = Math.max(0, Math.min(pos.x, mapSizeX));
        np.y = Math.max(0, Math.min(pos.y, mapSizeY));
        return np;
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
        _.forEach(itemJsons, function(itemJson) {
            var item =  new bq.object.DropItem(new bq.model.DropItem(itemJson));
            bq.baseLayer.addChild(item, bq.config.zOrder.DROP_ITEM);
            this.dropItems_[itemJson['dropId']] = item;
        }, this);
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