var store = require('beamQuest/store');
    playerModel = require('beamQuest/model/player');

exports.listen = function(socket) {
    // ログイン中の全ユーザを記憶
    // @type {Object.<model.Player>}
    var loginUsers_ = {};

    socket.on('login', function(data) {
        var invalidErr = validateUserId_(data.userId);
        if (invalidErr) {
            socket.emit('login:receive', invalidErr);
            return;
        };

        store.get('user:id:' + data.userId, function(err, val) {
            var result = {};
            if (!val) { // IDとハッシュが登録されていない
                store.set('user:id:' + data.userId, data.hash);
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
        if (!_.contains(loginUsers_, userId)) {
            var player = new playerModel();
            player.id = userId;
            player.socket = socket;
            loginUsers_[userId] = player;
        }
    }

    /**
     * ログイン中の全ユーザを返す
     * @return {Object}
     */
    function getLoginUsers() {
        return loginUsers_;
    }
};