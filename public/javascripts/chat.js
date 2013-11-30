var socket = io.connect();
 
socket.on('message:receive', function (data) {
  $("div#chat-area").prepend("<div>" + data.message + "</div>");
});
 
function send() {
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('message:send', { message: msg });
}
