require('beamQuest/init');
var path     = require('path'),
    express  = require('express'),
    http     = require('http'),
    socketIo = require('socket.io'),
    log4js   = require('log4js');

var app = express();

var expressLogWrapper = log4js.getLogger('express');

app.configure('development', function() {
    app.use(express.errorHandler());
    expressLogWrapper.setLevel('INFO');
});

app.configure('production', function() {
    expressLogWrapper.setLevel('WARN');
});


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(log4js.connectLogger(expressLogWrapper, {level: log4js.levels.INFO}));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

var backend = require('beamQuestBackend/main');
backend.listen(app);

var server = http.createServer(app);
server.listen(app.get('port'));

var io = socketIo.listen(server);

io.configure('production', function() {
    io.set('log level', 1);
});

var main = require('beamQuest/main');
main.start(io);

logger.info('start');
