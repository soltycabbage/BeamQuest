var Entities = require('beamQuest/store/entities');
var MapStore = require('beamQuest/store/maps');

/**
* @fileoverview ワールド全体のイベント（mob/npcの移動, ログイン数、天気、時刻）などなどを扱う
*/
var World = (function () {
    function World() {
        if (World.instance_) {
            throw new Error("Error: Instantiation failed: Use World.getInstance() instead of new.");
        }
        World.instance_ = this;
    }
    World.getInstance = function () {
        if (World.instance_ === undefined) {
            World.instance_ = new World();
        }
        return World.instance_;
    };

    World.prototype.listen = function (socket) {
        // マップに存在するEntityの一覧を返す
        // @type {Object.<mapId:number>} data
        socket.on('world:entities:get', function (data) {
            var result = {
                players: Entities.getInstance().getPlayersJSON(data.mapId),
                mobs: Entities.getInstance().getMobsJSON(data.mapId)
            };
            socket.emit('world:entities:receive', result);
        });

        // マップに存在するドロップアイテムの一覧を返す
        // @type {Object.<mapId:number>} data
        socket.on('world:dropitems:get', function (data) {
            var map = MapStore.getInstance().getMapById(data.mapId);
            if (map) {
                var result = {
                    dropitems: map.model.toObjectJSON(map.model.dropItems)
                };
                socket.emit('world:dropitems:receive', result);
            }
        });
    };
    return World;
})();
module.exports = World;
//# sourceMappingURL=world.js.map
