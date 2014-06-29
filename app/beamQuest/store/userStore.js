var kvs = require('beamQuest/store/kvs');

var UserStore = function() {
    this.store = kvs.createClient();
    this.getStoreKey_ = function(userId) {
        return "user:" + userId;
    };
    this.getSessionKey_ = function(sessionId) {
        return 'session:' + sessionId;
    };
};

UserStore.prototype.find = function(userId, callback) {
    var storeKey = this.getStoreKey_(userId);
    this.store.get(storeKey, function(error, val) {
        if (error) {
            callback(error);
        }
        var userData = (val) ? JSON.parse(val) : null;
        callback(null, userData);
    });
};

UserStore.prototype.save = function(user) {
    var storeKey = this.getStoreKey_(user.model.id);
    var data = JSON.stringify(user.model.toJSON());
    this.store.set(storeKey, data);
};

// redis のラッパすぎて抽象化できておらず
UserStore.prototype.getSessionData = function(sessionId, name, callback) {
    var storeKey = this.getSessionKey_(sessionId);
    this.store.hget(storeKey, name, function(error, val) {
        if (error) {
            callback(error);
        }
        callback(null, val);
    });
};

UserStore.prototype.saveSessionData = function(sessionId, name, data) {
    var storeKey = this.getSessionKey_(sessionId);
    this.store.hset(storeKey, name, data);
};

var instance_ = new UserStore();
module.exports = instance_;

