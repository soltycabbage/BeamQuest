exports.start = function(io) {
  io.sockets.on('connection', function(socket) {
    socket.on('message:send', function(data) {
      io.sockets.emit('message:receive', { message: data.message });
    });
  });
}

