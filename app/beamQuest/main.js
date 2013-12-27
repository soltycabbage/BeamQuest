var SessionStore = {
    session_: {},
    get: function (key, callback) {
        if (key in this.session_) {
            callback(null, this.session_[key]);
        }
        else {
            callback({error:1, messge:'notfound'});
        }
    },
    set: function (key, value) {
        this.session_[key] = value;
    }
};

var ping = require('beamQuest/ping');

exports.start = function(io) {
    var client = SessionStore;

    io.sockets.on('connection', function(socket) {
        socket.on('login', function(data) {
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

        // チャット
        socket.on('message:update', function(data) {
            socket.broadcast.emit('notify:message', data);
        });

        // プレイヤーが移動したら位置情報が送られてくる
        socket.on('user:position:update', function(data) {
            // 自分以外の全プレイヤーにブロードキャスト
            socket.broadcast.emit('notify:user:move', data);
        });

        ping.listen(socket);

        socket.emit('connected');
    });
};

