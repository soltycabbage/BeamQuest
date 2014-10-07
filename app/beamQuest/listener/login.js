var PlayerModel = require('beamQuest/model/player');
var PlayerCtrl = require('beamQuest/ctrl/player');
var PositionModel = require('beamQuest/model/position');
var Entities = require('beamQuest/store/entities');
var UserStore = require('beamQuest/store/userStore');
var kvs = require('beamQuest/store/kvs').createClient();
function listen(socket, io) {
    socket.on('login', onLogin);
    function onLogin(data) {
        var invalidErr = validateUserId_(data.userId);
        if (invalidErr) {
            socket.emit('login:receive', invalidErr);
            return;
        }
        login_(data);
    }
    function login_(loginData) {
        var respond_ = function (result) {
            socket.emit('login:receive', result);
        };
        UserStore.getInstance().find(loginData.userId, function (error, userData) {
            if (error) {
                return respond_(error);
            }
            if (userData && userData.hash !== loginData.hash) {
                return respond_({ result: 'error', message: 'すでに存在するキャラクターです。' });
            }
            var player = (userData) ? createPlayer_(userData) : createNewPlayer_(loginData);
            addLoginUser_(player);
            return respond_({ result: 'success', player: player.model.toJSON() });
        });
    }
    /**
     * @param {string} userId
     * @return {Object}
     * @private
     */
    function validateUserId_(userId) {
        var result = null;
        if (!userId.match(/^[a-zA-Zぁ-んァ-ン0-9]+$/)) {
            result = { result: 'error', message: '使用できないキャラクター名です。' };
        }
        return result;
    }
    function createPlayer_(userData) {
        var model = new PlayerModel(userData);
        model.socket = socket;
        model.position = new PositionModel(model.position);
        var player = new PlayerCtrl();
        player.setModel(model);
        player.respawn();
        return player;
    }
    function createNewPlayer_(loginData) {
        // TODO mapManager.getRespawnPoint的な奴で初期ポジションを取得する
        var position = new PositionModel({
            mapId: 1,
            x: 700,
            y: 700
        });
        var model = new PlayerModel({
            hash: loginData.hash,
            id: loginData.userId,
            name: loginData.userId,
            socket: socket,
            position: position
        });
        var player = new PlayerCtrl();
        player.setModel(model);
        return player;
    }
    /**
     * @param {string} userId
     * @private
     */
    function addLoginUser_(player) {
        var model = player.model;
        var position = model.position;
        Entities.getInstance().addPlayer(position.mapId, player);
        UserStore.getInstance().saveSessionData(socket.id, 'userId', player.model.id);
        UserStore.getInstance().saveSessionData(socket.id, 'mapId', player.model.position.mapId);
        player.scheduleUpdate();
        socket.broadcast.emit('notify:user:login', { 'userId': model.id });
        // 接続が切れたらログアウト扱い
        socket.on('disconnect', function () {
            UserStore.getInstance().save(player);
            Entities.getInstance().removePlayer(position.mapId, player);
            player.unscheduleUpdate();
            socket.broadcast.emit('notify:user:logout', { 'userId': player.model.id });
        });
    }
}
exports.listen = listen;
//# sourceMappingURL=login.js.map