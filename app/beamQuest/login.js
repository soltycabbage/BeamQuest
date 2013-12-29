var store = require('beamQuest/store');

exports.listen = function(socket) {
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
                result = {result: 'create'};
            } else if (val == data.hash) { // IDとハッシュが一致
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
};