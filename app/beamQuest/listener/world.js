/**
 * @fileoverview ワールド全体のイベント（mob/npcの移動, ログイン数、天気、時刻）などなどを扱う
 */
var entities = require('beamQuest/store/entities'),
    MapStore = require('beamQuest/store/maps');

exports.listen = function(socket) {
    // マップに存在するEntityの一覧を返す
    // @type {Object.<mapId:number>} data
    socket.on('world:entities:get', function(data) {
        var result = {
            players: entities.getPlayersJSON(data.mapId),
            mobs: entities.getMobsJSON(data.mapId)
            // npc: entities.getNpc() みたいな感じを想定
        };
        socket.emit('world:entities:receive', result);
    });

    // マップに存在するドロップアイテムの一覧を返す
    // @type {Object.<mapId:number>} data
    socket.on('world:dropitems:get', function(data) {
        var map = MapStore.getInstance().getMapById(data.mapId);
        if (map) {
            var result = {
                dropitems: map.model.toObjectJSON(map.model.dropItems)
            };
            socket.emit('world:dropitems:receive', result);
        }
    });
};
