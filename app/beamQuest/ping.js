exports.listen = function(socket) {
    socket.on('ping:update', function(data) {
        socket.emit('notify:ping', data);
    });
};

