exports.listen = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.get('/backend', function(req, res) {
        res.render('index');
    });

    app.post('/backend/kvs/purge', function(req, res) {
        var redis = require('redis').createClient();

        redis.flushall();

        res.json({});
        logger.info('kvs purge');
    });
};
