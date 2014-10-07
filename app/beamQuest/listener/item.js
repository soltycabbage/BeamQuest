/// <reference path="../../../typings/tsd.d.ts" />
var MapStore = require('beamQuest/store/maps');
var EntityStore = require('beamQuest/store/entities');
/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */
var Item = (function () {
    function Item() {
        if (Item.instance_) {
            throw new Error("Error: Instantiation failed: Use Item.getInstance() instead of new.");
        }
        Item.instance_ = this;
    }
    Item.getInstance = function () {
        if (Item.instance_ === undefined) {
            Item.instance_ = new Item();
        }
        return Item.instance_;
    };
    Item.prototype.listen = function (socket, io) {
        this.socket_ = socket;
        this.io_ = io;
        this.socket_.on('item:pick', this.handlePickItem_.bind(this));
    };
    /**
     * 指定位置に指定アイテムをまき散らす
     * @param {Array.<model.dropItem>} dropItems
     * @param {model.Position} position
     */
    Item.prototype.drop = function (dropItems, position) {
        if (this.io_ && !_.isEmpty(dropItems)) {
            var map = MapStore.getInstance().getMapById(position.mapId);
            var datas = [];
            _.forEach(dropItems, function (dropItem) {
                var p = _.clone(position);
                // ドロップ位置を散らす
                p.x += Math.random() * 64;
                p.y += Math.random() * 64;
                dropItem.setPosition(p);
                datas.push(dropItem.toJSON());
            });
            map.addDropItems(dropItems);
            this.io_.sockets.emit('notify:item:drop', datas);
        }
    };
    /**
     * プレイヤーからのアイテム取得要求
     * @param {Object} data
     */
    Item.prototype.handlePickItem_ = function (data) {
        if (this.io_ && data && data.mapId && data.pickerId && data.dropId) {
            var map = MapStore.getInstance().getMapById(data.mapId);
            var picker = EntityStore.getInstance().getPlayerById(data.mapId, data.pickerId);
            if (map && picker) {
                var dropItem = map.model.dropItems[data.dropId];
                if (dropItem) {
                    var res = dropItem.toJSON();
                    res['pickerId'] = picker.model.id;
                    res['pickerPosition'] = picker.model.position.toJSON();
                    // TODO 取得プレイヤーのインベントリにアイテムを追加
                    this.io_.sockets.emit('notify:item:pick', res);
                    delete map.model.dropItems[data.dropId];
                }
            }
        }
    };
    return Item;
})();
module.exports = Item;
//# sourceMappingURL=item.js.map