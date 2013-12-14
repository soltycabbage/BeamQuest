/**
 * @fileoverview チャット全般を扱うクラス
 */
var Chat = cc.Class.extend({
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
        // TODO: サーバへの送信処理を書く
        bq.player.showMessage(value);
        this.gameCanvas_.focus();
    }
});