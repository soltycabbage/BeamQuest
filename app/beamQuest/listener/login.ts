import PlayerModel = require('beamQuest/model/player');
import PlayerCtrl = require('beamQuest/ctrl/player');
import PositionModel = require('beamQuest/model/position');
import Entities = require('beamQuest/store/entities');
import UserStore = require('beamQuest/store/userStore');

declare var logger: any;

var kvs = require('beamQuest/store/kvs').createClient();

export function listen(socket, io) {
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
        UserStore.getInstance().find(loginData.userId, function(error, userData) {
            if (error) {
                return respond_(error);
            }

            if (userData && userData.hash !== loginData.hash) {
                logger.debug('user login failed');
                return respond_({result: 'error', message: 'すでに存在するキャラクターです。'});
            }

            var player;
            if (userData) {
                logger.debug('user login successed');
                player = createPlayer_(userData)
            } else {
                logger.debug('user created and login');
                player = createNewPlayer_(loginData);
            }
            addLoginUser_(player);

            return respond_({result: 'success', mapId: 1, player: player.model.toJSON()});
        });
    }

    /**
     * @param {string} userId
     * @return {Object}
     * @private
     */
    function validateUserId_(userId) {
        var result:any = null;
        if (!userId.match(/^[a-zA-Zぁ-んァ-ン0-9]+$/)) {
            result = {result: 'error', message: '使用できないキャラクター名です。'};
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
        Entities.getInstance().addPlayer(player);
        UserStore.getInstance().saveSessionData(socket.id, 'userId', player.model.id);
        player.scheduleUpdate();
        socket.broadcast.emit('notify:user:login', {'userId': model.id});
        logger.debug('user login notified: userId "' + model.id + '" in ' + player.model.mapId);

        // 接続が切れたらログアウト扱い
        socket.on('disconnect', function() {
            UserStore.getInstance().save(player);
            Entities.getInstance().removePlayer(player);
            player.unscheduleUpdate();
            socket.broadcast.emit('notify:user:logout', {'userId': player.model.id});
            logger.debug('socket.io connection closed');
        });
    }
}
