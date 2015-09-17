/// <reference path="../../../typings/tsd.d.ts" />

import MapStore = require('../store/maps');
import EntityStore = require('../store/entities');
import Position = require('../model/position');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

class Item {
    private static instance_:Item;
    public static getInstance():Item {
        if (Item.instance_ === undefined) {
            Item.instance_ = new Item();
        }
        return Item.instance_;
    }

    constructor() {
        if (Item.instance_){
            throw new Error("Error: Instantiation failed: Use Item.getInstance() instead of new.");
        }
        Item.instance_ = this;
    }

    private socket_;
    private io_;
    listen(socket, io) {
        this.socket_ = socket;
        this.io_ = io;

        this.socket_.on('item:pick', this.handlePickItem_.bind(this));
    }

    /**
     * プレイヤーからのアイテム取得要求
     * @param {Object} data
     */
     private handlePickItem_(data:any) {
        if (this.io_ && data && data.mapId && data.pickerId && data.dropId) {
            var map:any = MapStore.getInstance().getMapById(data.mapId);
            var picker = EntityStore.getInstance().getPlayerById(data.pickerId);
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
    }

    /**
     * リスナで notify するのに違和感がある
     * @param data
     */
    public notify(data) {
        this.io_.sockets.emit('notify:item:drop', data);
    }

}


export = Item;
