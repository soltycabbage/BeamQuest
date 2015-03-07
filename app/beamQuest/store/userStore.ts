import kvs = require('beamQuest/store/kvs');

class UserStore {
    private static instance_:UserStore;
    public static getInstance():UserStore {
        if (UserStore.instance_ === undefined) {
            UserStore.instance_ = new UserStore();
        }
        return UserStore.instance_;
    }

    constructor() {
        if (UserStore.instance_){
            throw new Error("Error: Instantiation failed: Use UserStore.getInstance() instead of new.");
        }
        UserStore.instance_ = this;

        this.store = kvs.createClient();
    }

    store:kvs.Client;

    private getStoreKey_(userId) {
        return "user:" + userId;
    }
    private getSessionKey_(sessionId) {
        return 'session:' + sessionId;
    }

    find(userId, callback) {
        var storeKey = this.getStoreKey_(userId);
        this.store.hgetall(storeKey, function(error, val) {
            if (error) {
                callback(error);
            }
            callback(null, val);
        });
    }

    save(user) {
        var storeKey = this.getStoreKey_(user.model.id);
        var data = user.model.toJSON();
        this.store.hmset(storeKey, data);
    }

    // redis のラッパすぎて抽象化できておらず
    getSessionData(sessionId, name, callback) {
        var storeKey = this.getSessionKey_(sessionId);
        this.store.hget(storeKey, name, function(error, val) {
            if (error) {
                callback(error);
            }
            callback(null, val);
        });
    }

    saveSessionData(sessionId, name, data) {
        var storeKey = this.getSessionKey_(sessionId);
        this.store.hset(storeKey, name, data);
    }
}

export = UserStore;
