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
            callback({error:1, messge:'notfound'});
        }
    },
    set: function (key, value) {
        this.session_[key] = value;
    }
};

exports.get = function(key, callback) {
    SessionStore.get(key, callback);
};

exports.set = function(key, value) {
    SessionStore.set(key, value);
};
