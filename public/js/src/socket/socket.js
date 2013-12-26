/**
 * @fileoverview socket.ioの初期設定をする
 */

bq.Socket = cc.Class.extend({
    ctor: function() {
        this.socket = io.connect();
    },

    /**
     * ログイン後にsocketで受け取る処理を書く
     */
    initAfterLogin: function() {
        var playerManager = bq.PlayerManager.getInstance();

        // チャット受信
        this.socket.on('notify:message', function (data) {
            var chatData = new bq.model.Chat(data);
            playerManager.chat(chatData)
        });

        // 他プレイヤーの移動
        this.socket.on('notify:user:move', function(data) {
            var moveData = new bq.model.PlayerMove(data);
            playerManager.moveTo(moveData);
        });
    },

    /**
     * ログインを試みる。レスポンスが返ってきたらcallbackを実行する
     * @param {string} userId
     * @param {string} hash
     * @param {Function} callback
     * @param {Object} selfObj
     */
    tryLogin: function(userId, hash, callback, selfObj) {
        this.socket.emit('login', {userId: userId, hash: hash});
        this.socket.once('login:receive', $.proxy(callback, selfObj));
    },

    /**
     * @param {Object} chatData
     */
    sendChat: function(chatData) {
        this.socket.emit('message:update', chatData);
    },

    /**
     * プレイヤーの絶対座標をサーバに送信する
     * @param {Object:<mapId: number, x: number, y: number>} pos
     */
    sendPlayerPosition: function(pos) {
        this.socket.emit('user:position:update', pos);
    }
});

bq.Socket.instance_ = new bq.Socket();

bq.Socket.getInstance = function() {
    return bq.Socket.instance_;
};
