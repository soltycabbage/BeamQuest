/**
 * @fileoverview ワールド全体のイベント（mob/npcの移動, ログイン数、天気、時刻）などなどを扱う
 */
var entities = require('beamQuest/store/entities');

exports.listen = function(socket) {
    // マップに存在するEntityの一覧を返す
    // @type {Object.<mapId:number>} data
    socket.on('world:entities:get', function(data) {
        var result = {
            players: entities.getPlayersJSON(data.mapId)
            // npc: entities.getNpc() みたいな感じを想定
        };
        socket.emit('world:entities:receive', result);
    });
};