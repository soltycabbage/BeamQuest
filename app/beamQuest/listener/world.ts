import Entities = require('beamQuest/store/entities');
import MapStore = require('beamQuest/store/maps');

/**
 * @fileoverview ワールド全体のイベント（mob/npcの移動, ログイン数、天気、時刻）などなどを扱う
 */
class World {
    private static instance_:World;
    public static getInstance():World {
        if (World.instance_ === undefined) {
            World.instance_ = new World();
        }
        return World.instance_;
    }

    constructor() {
        if (World.instance_){
            throw new Error("Error: Instantiation failed: Use World.getInstance() instead of new.");
        }
        World.instance_ = this;
    }

    listen(socket) {
        // マップに存在するEntityの一覧を返す
        // @type {Object.<mapId:number>} data
        socket.on('world:entities:get', function(data) {
            var result = {
                players: Entities.getInstance().getPlayersJSON(data.mapId),
                mobs: Entities.getInstance().getMobsJSON(data.mapId)
                // npc: entities.getNpc() みたいな感じを想定
            };
            socket.emit('world:entities:receive', result);
        });

        // マップに存在するドロップアイテムの一覧を返す
        // @type {Object.<mapId:number>} data
        socket.on('world:dropitems:get', function(data) {
            var map:any = MapStore.getInstance().getMapById(data.mapId);
            if (map) {
                var result = {
                    dropitems: map.model.toObjectJSON(map.model.dropItems)
                };
                socket.emit('world:dropitems:receive', result);
            }
        });
    }
}
export = World;
