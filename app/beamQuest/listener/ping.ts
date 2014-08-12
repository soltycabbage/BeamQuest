export function listen(socket) {
    socket.on('ping:update', function(data) {
        socket.emit('notify:ping', data);
    });
}
