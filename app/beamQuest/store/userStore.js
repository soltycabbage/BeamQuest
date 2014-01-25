var kvs = require('beamQuest/store/kvs');

var UserStore = function() {
    this.store = kvs.createClient();
    this.getStoreKey_ = function(userId) {
        return "user:" + userId;
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

var instance_ = new UserStore();
module.exports = instance_;

