var kvs = require('beamQuest/store/kvs'),
    playerCtrl = require('beamQuest/ctrl/player'),
    playerModel = require('beamQuest/model/player'),
    positionModel = require('beamQuest/model/position'),
    entities = require('beamQuest/store/entities');

exports.listen = function(socket, io) {
    socket.on('login', function(data) {
        var invalidErr = validateUserId_(data.userId);
        if (invalidErr) {
            socket.emit('login:receive', invalidErr);
            return;
        }

        kvs.get('user:id:' + data.userId, function(err, val) {
            var result = {};
            if (!val) { // IDとハッシュが登録されていない
                kvs.set('user:id:' + data.userId, data.hash);
                addLoginUser_(data.userId);
                result = {result: 'create'};
            } else if (val == data.hash) { // IDとハッシュが一致
                addLoginUser_(data.userId);
                result = {result: 'success'};
            } else { // IDは存在するけどハッシュが違う
                result = {result: 'error', message: 'すでに存在するキャラクターです。'};
            }
            socket.emit('login:receive', result);
        });
    });

    /**
     * @param {string} userId
     * @return {Object}
     * @private
     */
    function validateUserId_(userId) {
        var result = null;
        if (!userId.match(/^[a-zA-Zぁ-んァ-ン0-9]+$/)) {
            result = {result: 'error', message: '使用できないキャラクター名です。'};
        }
        return result;
    }

    /**
     * @param {string} userId
     * @private
     */
    function addLoginUser_(userId) {
        var position = new positionModel({
            mapId: 1, // TODO: ログアウト時の位置を記憶しておいてセットする
            x: 200,
            y: 200
        });

        var player = new playerCtrl();
        var model = new playerModel({
            id: userId,
            name: userId,
            socket: socket,
            position: position
        });
        player.setModel(model);
        entities.addPlayer(position.mapId, player);

        socket.on('disconnect', function() {
            entities.removePlayer(position.mapId, player);
            kvs.del('user:id:' + player.id);
            io.sockets.emit('notify:user:logout', {userId: player.id});
        });
    }

    /**
     * ログイン中の全ユーザを返す
     * @return {Object}
     */
    function getLoginUsers() {
        return loginUsers_;
    }
};
