var store = require('beamQuest/store');

exports.listen = function(socket) {
    socket.on('login', function(data) {
        var encodedId = new Buffer(data.userId).toString('base64');
        store.get('user:id:' + encodedId, function(err, val) {
            var result = {};
            if (!val) { // IDとハッシュが登録されていない
                store.set('user:id:' + encodedId, data.hash);
                result = {result: 'create'};
            } else if (val == data.hash) { // IDとハッシュが一致
                result = {result: 'success'};
            } else { // IDは存在するけどハッシュが違う
                result = {result: 'fail'};
            }
            socket.emit('login:receive', result);
        });
    });
};