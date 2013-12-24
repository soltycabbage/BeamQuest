/**
 * @fileoverview socket.ioの初期設定をする
 */

bq.Socket = cc.Class.extend({
    ctor: function() {
        this.socket = io.connect();
        this.init();
    },

    init: function() {
        this.socket.on('notify:message', function (data) {
            bq.player.showMessage(data.message + ' echo');
        });

        // 他プレイヤーの移動
        this.socket.on('notify:user:move', function(data) {
            console.log(data.userId + ': ' + 'x:'+ data.x + ' y:'+ data.y);
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

    sendChat: function(text) {
        this.socket.emit('message:update', {message:text});
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
