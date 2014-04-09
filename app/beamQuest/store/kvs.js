/**
 * @fileoverview オンメモリのKVS的なやつ。redisに置き換える？
 */
var redis = require('redis');

var SessionStore = {
    session_: {},
    get: function (key, callback) {
        if (key in this.session_) {
            callback(null, this.session_[key]);
        }
        else {
            callback(null, null);
        }
    },
    set: function (key, value) {
        this.session_[key] = value;
    },
    del: function (key) {
        delete this.session_[key];
    },
    flushall: function(callback) {
        this.session_ = {};
        logger.info('kvs flushall');
        callback(true);
    }
};

exports.createClient = function() {
    if (process.env.NODE_ENV === 'development') {
        return SessionStore;
    } else {
        return redis.createClient();
    }
};
