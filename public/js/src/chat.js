/**
 * @fileoverview チャット全般を扱うクラス
 */

bq.Chat = cc.Class.extend({
    ctor: function() {
        this.chatInput_ = $('#bq-chat-input')[0];
        this.gameCanvas_ = $('#gameCanvas')[0];
        this.initChatHandler_();
    },

    /**
     * チャット入力欄のsubmitイベントのハンドラ登録
     * @private
     */
    initChatHandler_: function() {
        $('#bq-chat-form').bind('submit', $.proxy(function(evt) {
            evt.preventDefault();
            this.submitChat(this.chatInput_.value);
            this.chatInput_.value = '';
        }, this));
    },

    /**
     * 入力欄にフォーカスする
     */
    focusChat: function() {
        this.chatInput_.focus();
    },

    /**
     * チャットを送信する
     * @param {string} value
     */
    submitChat: function(value) {
        this.gameCanvas_.focus();
        if (value.length === 0) {return;}
        bq.Socket.getInstance().sendChat({userId: bq.player.name, message: value});
        bq.player.showMessage(value);
        var msgLog = bq.MessageLog.getInstance();
        msgLog.addChatMsg(bq.player.name + ': ' + value);
    }
});