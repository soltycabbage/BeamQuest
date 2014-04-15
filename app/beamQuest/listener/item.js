var mapStore = require('beamQuest/store/maps');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

var Item = function() {
};

Item.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;
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
            p.x += Math.random() * 32 - 16;
            p.y += Math.random() * 32 - 16;
            dropItem.setPosition(p);
            datas.push(dropItem.toJSON());
        });

        map.addDropItems(dropItems);
        this.io_.sockets.emit('notify:item:drop', datas);
    }
};

var instance_ = new Item();
module.exports = instance_;
