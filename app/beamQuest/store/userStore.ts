import kvs = require('beamQuest/store/kvs');

var store:kvs.Client = kvs.createClient();

function getStoreKey_(userId) {
    return "user:" + userId;
}
function getSessionKey_(sessionId) {
    return 'session:' + sessionId;
}

export function find(userId, callback) {
    var storeKey = getStoreKey_(userId);
    store.hgetall(storeKey, function(error, val) {
        if (error) {
            callback(error);
        }
        if (val) {
            Object.keys(val).forEach(function(key) {
                val[key] = JSON.parse(val[key]);
            });
        }
        callback(null, val);
    });
}

export function save(user) {
    var storeKey = getStoreKey_(user.model.id);
    var data = user.model.toJSON();
    Object.keys(data).forEach(function(key) {
        data[key] = JSON.stringify(data[key]);
    });
    store.hmset(storeKey, data);
}

// redis のラッパすぎて抽象化できておらず
export function getSessionData(sessionId, name, callback) {
    var storeKey = getSessionKey_(sessionId);
    store.hget(storeKey, name, function(error, val) {
        if (error) {
            callback(error);
        }
        callback(null, val);
    });
}

export function saveSessionData(sessionId, name, data) {
    var storeKey = getSessionKey_(sessionId);
    store.hset(storeKey, name, data);
}
