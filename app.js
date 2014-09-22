require('beamQuest/init');
var path     = require('path'),
    express  = require('express'),
    bodyParser = require('body-parser'),
    http     = require('http'),
    socketIo = require('socket.io'),
    log4js   = require('log4js'),
    redis = require('socket.io-redis'),
    config   = require('config');

var app = express();

var expressLogWrapper = log4js.getLogger('express');

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    expressLogWrapper.setLevel('INFO');
}

if ('production' == env || 'heroku' == env) {
    expressLogWrapper.setLevel('WARN');
}

app.set('port', process.env.PORT || 3000);
app.use(log4js.connectLogger(expressLogWrapper, {level: log4js.levels.INFO}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

var backend = require('beamQuestBackend/main');
app.use('/backend', backend(app));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

 if ('development' == env) {
     app.use(require('errorhandler')());
 }

module.exports = app;

var server = app.listen(app.get('port'));
var io = socketIo.listen(server);

var CONFIG = config.session;
logger.info('session type: ' + CONFIG.type);
if (CONFIG.type === 'redis') {
    io.set('log level', 1);
    io.adapter(redis({
        host: CONFIG.host,
        port: CONFIG.port
    }));
}

var main = require('beamQuest/main');
main.start(io);

logger.info('start');
