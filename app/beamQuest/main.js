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

        socket.on('message:send', function(data) {
            io.sockets.emit('message:receive', { message: data.message });
        });

        socket.emit('connected');
  });
};

