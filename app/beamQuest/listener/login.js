var kvs = require('beamQuest/store/kvs');
    playerModel = require('beamQuest/model/player'),
    entities = require('beamQuest/store/entities');

exports.listen = function(socket) {
    socket.on('login', function(data) {
        var invalidErr = validateUserId_(data.userId);
        if (invalidErr) {
            socket.emit('login:receive', invalidErr);
            return;
        };

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
        var player = new playerModel();
        player.id = userId;
        player.socket = socket;
        entities.addPlayer(player);
    }

    /**
     * ログイン中の全ユーザを返す
     * @return {Object}
     */
    function getLoginUsers() {
        return loginUsers_;
    }
};