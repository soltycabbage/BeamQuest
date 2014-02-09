bq.MessageLog = cc.Class.extend({
    ctor: function() {
        /**
         * チャットログウィンドウ全体
         * @type {Element}
         */
        this.logWindow = $('#bq-message-log');

        /**
         * チャットログでユーザに見えてる部分
         * @type {Element}
         */
        this.logDisplayed = $('#bq-message-log-inner');

        /**
         * 表示する行数
         * @type {Number}
         */
        this.maxDisplaySize_ = 4;
    },

    /**
     * チャット
     * @param {string} msg
     */
    addChatMsg: function(msg) {
        this.add_(msg);
    },

    /**
     * システムメッセージ
     * @param {string} msg
     */
    addSystemMsg: function(msg) {
        this.add_(msg, '#ff0'); // 黄色
    },


    /**
     * @param {string} msg
     * @param {string=} opt_color 文字色(#000)
     * @private
     */
    add_: function(msg, opt_color) {
        var color = opt_color || '#fff';
        var valueEl = $('<div/>').addClass('bq-message-log-value');
        valueEl.text(msg);
        valueEl.css('color', color);
        this.logDisplayed.append(valueEl);

        var values = $('.bq-message-log-value');
        var logSize = values.length;
        _.each(values, function(value, index) {
            if (index < (logSize - this.maxDisplaySize_)) {
                $(value).hide();
            }
        }.bind(this));
    }
});

bq.MessageLog.instance_ = new bq.MessageLog();
bq.MessageLog.getInstance = function() {
    return bq.MessageLog.instance_;
};