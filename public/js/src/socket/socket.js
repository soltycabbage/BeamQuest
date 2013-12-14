/**
 * @fileoverview socket.ioの初期設定をする
 */

var Socket = cc.Class.extend({
    ctor: function() {
        this.socket = io.connect();
        this.init();
    },

    init: function() {
        this.socket.on('connected', function (data) {

        });
    }
});

Socket.instance_ = new Socket();

Socket.getInstance = function() {
    return Socket.instance_;
};
