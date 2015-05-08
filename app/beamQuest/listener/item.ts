/// <reference path="../../../typings/tsd.d.ts" />

import MapStore = require('beamQuest/store/maps');
import EntityStore = require('beamQuest/store/entities');
import Position = require('beamQuest/model/position');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */


var socket_;
var io_;

export function listen(socket, io) {
    socket_ = socket;
    io_ = io;

    socket_.on('item:pick', handlePickItem_.bind(this));
}

/**
 * プレイヤーからのアイテム取得要求
 * @param {Object} data
 */
function handlePickItem_(data:any) {
    if (io_ && data && data.mapId && data.pickerId && data.dropId) {
        var map:any = MapStore.getMapById(data.mapId);
        var picker = EntityStore.getPlayerById(data.pickerId);
        if (map && picker) {
            var dropItem = map.model.dropItems[data.dropId];
            if (dropItem) {
                var res = dropItem.toJSON();
                res['pickerId'] = picker.model.id;
                res['pickerPosition'] = picker.model.position.toJSON();
                // TODO 取得プレイヤーのインベントリにアイテムを追加
                io_.sockets.emit('notify:item:pick', res);
                delete map.model.dropItems[data.dropId];
            }
        }
    }
}

/**
 * リスナで notify するのに違和感がある
 * @param data
 */
export function notify(data) {
    io_.sockets.emit('notify:item:drop', data);
}
