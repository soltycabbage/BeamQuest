var playerModel = require('beamQuest/model/player'),
    playerCtrl = require('beamQuest/ctrl/player'),
    positionModel = require('beamQuest/model/position'),
    entities = require('beamQuest/store/entities'),
    userStore = require('beamQuest/store/userStore');
var kvs = require('beamQuest/store/kvs').createClient();

exports.listen = function(socket, io) {
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
        var respond_ = function(result) { socket.emit('login:receive', result); };
        userStore.find(loginData.userId, function(error, userData) {
            if (error) {
                return respond_(error);
            }

            if (userData && userData.hash !== loginData.hash) {
                return respond_({result: 'error', message: 'すでに存在するキャラクターです。'});
            }

            var player = (userData) ? createPlayer_(userData) : createNewPlayer_(loginData);
            addLoginUser_(player);

            return respond_({result: 'success', player: player.model.toJSON()});
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
            result = {result: 'error', message: '使用できないキャラクター名です。'};
        }
        return result;
    }

    function createPlayer_(userData) {
        var model = new playerModel(userData);
        model.socket = socket;
        model.position = new positionModel(model.position);
        var player = new playerCtrl();
        player.setModel(model);
        return player;
    }

    function createNewPlayer_(loginData) {
        // TODO mapManager.getRespawnPoint的な奴で初期ポジションを取得する
        var position = new positionModel({
            mapId: 1,
            x: 700,
            y: 700
        });
        var model = new playerModel({
            hash: loginData.hash,
            id: loginData.userId,
            name: loginData.userId,
            socket: socket,
            position: position
        });
        var player = new playerCtrl();
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
        entities.addPlayer(position.mapId, player);
        player.scheduleUpdate();

        // 接続が切れたらログアウト扱い
        socket.on('disconnect', function() {
            userStore.save(player);
            entities.removePlayer(position.mapId, player);
            player.unscheduleUpdate();
            io.sockets.emit('notify:user:logout', {'userId': player.model.id});
        });
    }
};
