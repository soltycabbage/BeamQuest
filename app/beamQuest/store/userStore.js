var kvs = require('beamQuest/store/kvs');
var UserStore = (function () {
    function UserStore() {
        if (UserStore.instance_) {
            throw new Error("Error: Instantiation failed: Use UserStore.getInstance() instead of new.");
        }
        UserStore.instance_ = this;
        this.store = kvs.createClient();
    }
    UserStore.getInstance = function () {
        if (UserStore.instance_ === undefined) {
            UserStore.instance_ = new UserStore();
        }
        return UserStore.instance_;
    };
    UserStore.prototype.getStoreKey_ = function (userId) {
        return "user:" + userId;
    };
    UserStore.prototype.getSessionKey_ = function (sessionId) {
        return 'session:' + sessionId;
    };
    UserStore.prototype.find = function (userId, callback) {
        var storeKey = this.getStoreKey_(userId);
        this.store.get(storeKey, function (error, val) {
            if (error) {
                callback(error);
            }
            var userData = (val) ? JSON.parse(val) : null;
            callback(null, userData);
        });
    };
    UserStore.prototype.save = function (user) {
        var storeKey = this.getStoreKey_(user.model.id);
        var data = JSON.stringify(user.model.toJSON());
        this.store.set(storeKey, data);
    };
    // redis のラッパすぎて抽象化できておらず
    UserStore.prototype.getSessionData = function (sessionId, name, callback) {
        var storeKey = this.getSessionKey_(sessionId);
        this.store.hget(storeKey, name, function (error, val) {
            if (error) {
                callback(error);
            }
            callback(null, val);
        });
    };
    UserStore.prototype.saveSessionData = function (sessionId, name, data) {
        var storeKey = this.getSessionKey_(sessionId);
        this.store.hset(storeKey, name, data);
    };
    return UserStore;
})();
module.exports = UserStore;
//# sourceMappingURL=userStore.js.map