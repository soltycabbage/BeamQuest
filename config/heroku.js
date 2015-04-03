var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);

module.exports = {
    kvs: {
        type: "redis",
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisURL.auth.split(":")[1]
    },
    session: {
        type: "redis",
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisURL.auth.split(":")[1]
    }
};
