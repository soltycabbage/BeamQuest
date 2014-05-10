require('beamQuest/init');
var path     = require('path'),
    express  = require('express'),
    bodyParser = require('body-parser'),
    http     = require('http'),
    socketIo = require('socket.io'),
    log4js   = require('log4js');

var app = express();

var expressLogWrapper = log4js.getLogger('express');

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    app.use(require('errorhandler')());
    expressLogWrapper.setLevel('INFO');
}

if ('production' == env) {
    expressLogWrapper.setLevel('WARN');
}

app.set('port', process.env.PORT || 3000);
app.use(require('static-favicon')());
app.use(log4js.connectLogger(expressLogWrapper, {level: log4js.levels.INFO}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

var server = app.listen(app.get('port'));
var io = socketIo.listen(server);

io.configure('production', function() {
    io.set('log level', 1);
});

var main = require('beamQuest/main');
main.start(io);

logger.info('start');
