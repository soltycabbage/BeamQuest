/**
 * @fileoverview ワールド全体のイベント（ログイン数、天気、時刻）などなどを扱う
 */
var entities = require('beamQuest/store/entities');

exports.listen = function(socket) {
    // マップに存在するEntityの一覧を返す
    socket.on('world:entities:get', function(data) {
        var result = {
            players: entities.getPlayersJSON()
            // npc: entities.getNpc() みたいな感じを想定
        };
        socket.emit('world:entities:receive', result);
    });
};