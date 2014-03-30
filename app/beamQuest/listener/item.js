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
 * @param {Array.<string>}itemIds
 * @param {model.Position} position
 */
Item.prototype.drop = function(itemIds, position) {
    // TODO: ドロップごとに固有のIDを振っておかないと拾われた時に識別できない
    if (this.io_ && !_.isEmpty(itemIds)) {
        var datas = [];
        _.forEach(itemIds, function(itemId) {
            var p = _.clone(position);
            // ドロップ位置を散らす
            p.x += Math.random() * 32 - 16;
            p.y += Math.random() * 32 - 16;
            datas.push({
                id: itemId,
                position: p
            });
        });

        this.io_.sockets.emit('notify:item:drop', datas);
    }
};

var instance_ = new Item();
module.exports = instance_;
