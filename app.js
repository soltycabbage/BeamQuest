_ = require('underscore');
var path     = require('path'),
    express  = require('express'),
    http     = require('http'),
    socketIo = require('socket.io');

var app = express();

app.configure('development', function() {
    app.use(express.errorHandler());
    app.use(express.logger('dev'));
});
 
app.configure('production', function() {
    app.use(express.logger('default'));
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app);
server.listen(app.get('port'));
 
var io = socketIo.listen(server);

var chat = require('beamQuest/main');
chat.start(io);

