function listen(socket) {
    socket.on('ping:update', function (data) {
        socket.emit('notify:ping', data);
    });
}
exports.listen = listen;
//# sourceMappingURL=ping.js.map