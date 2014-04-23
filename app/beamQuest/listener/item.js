var mapStore = require('beamQuest/store/maps'),
    entityStore = require('beamQuest/store/entities'),
    inventoryStore = require('beamQuest/store/inventory');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

var Item = function() {
};

Item.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;

    this.socket_.on('item:pick', this.handlePickItem_.bind(this));
};

/**
 * 指定位置に指定アイテムをまき散らす
 * @param {Array.<model.dropItem>} dropItems
 * @param {model.Position} position
 */
Item.prototype.drop = function(dropItems, position) {
    if (this.io_ && !_.isEmpty(dropItems)) {
        var map = mapStore.getMapById(position.mapId);
        var datas = [];
        _.forEach(dropItems, function(dropItem) {
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
 * @private
 */
Item.prototype.handlePickItem_ = function(data) {
    if (this.io_ && data && data.mapId && data.pickerId && data.dropId) {
        var map = mapStore.getMapById(data.mapId);
        var picker = entityStore.getPlayerById(data.mapId, data.pickerId);
        if (map && picker) {
            var dropItem = map.model.dropItems[data.dropId];
            if (dropItem) {
                var res = dropItem.toJSON();
                res['pickerId'] = picker.model.id;
                res['pickerPosition'] = picker.model.position.toJSON();
                inventoryStore.push(picker.model.id, dropItem.item, dropItem.num);
                this.io_.sockets.emit('notify:item:pick', res);
                delete map.model.dropItems[data.dropId];
            }
        }
    }
};

var instance_ = new Item();
module.exports = instance_;
