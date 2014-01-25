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

    addChatMsg: function(msg) {
        this.add_(msg);
    },

    add_: function(msg) {
        var valueEl = $('<div/>').addClass('bq-message-log-value');
        valueEl.text(msg);
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

var instance_ = new bq.MessageLog();
bq.MessageLog.getInstance = function() {
    return instance_;
};