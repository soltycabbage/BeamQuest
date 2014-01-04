/**
 * @fileoverview オンメモリのKVS的なやつ。redisに置き換える？
 */

var SessionStore = {
    session_: {},
    get: function (key, callback) {
        if (key in this.session_) {
            callback(null, this.session_[key]);
        }
        else {
            callback({error:1, message:'notfound'});
        }
    },
    set: function (key, value) {
        this.session_[key] = value;
    },
    del: function (key) {
        delete this.session_[key];
    }
};

exports.get = function(key, callback) {
    SessionStore.get(key, callback);
};

exports.set = function(key, value) {
    SessionStore.set(key, value);
};

exports.del = function(key) {
    SessionStore.del(key);
};