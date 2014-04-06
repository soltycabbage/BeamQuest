exports.listen = function(app) {
    app.get('/backend', function(req, res) {
        res.send('<form action="/backend/kvs/purge" method="POST"><button type="submit">redis リセット</button></form>');
    });

    app.post('/backend/kvs/purge', function(req, res) {
        var redis = require('redis').createClient();

        redis.flushall();

        res.send('DONE');
        logger.info('kvs purge');
    });
};
