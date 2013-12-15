exports.start = function(io) {
    var client = require('redis').createClient();

    io.sockets.on('connection', function(socket) {
        socket.on('login', function(data) {
            // TODO: userIdに':'とか使われたやばい気がするが今はDon't think. Feel.
            // base64 エンコーディングするとかどっすか
            var encodedId = new Buffer(data.userId).toString('base64');
            client.get('user:id:' + encodedId, function(err, val) {
                var result = {};
                if (!val) { // IDとハッシュが登録されていない
                    client.set('user:id:' + encodedId, data.hash);
                    result = {result: 'create'};
                } else if (val == data.hash) { // IDとハッシュが一致
                    result = {result: 'success'};
                } else { // IDは存在するけどハッシュが違う
                    result = {result: 'fail'};
                }
                socket.emit('login:receive', result);
            });
        });

        socket.on('message:send', function(data) {
            io.sockets.emit('message:receive', { message: data.message });
        });

        socket.emit('connected');
  });
};

