bq.hud.InstantMsg = bq.hud.HudItem.extend({
    ctor: function() {
        this.container_ = $('#bq-instant-msg');

        this.inner_ = $('.bq-instant-msg-inner', this.container_);

        /**
         * メッセージ一覧
         * @type {Array.<Element>}
         * @private
         */
        this.msgs_ = [];

        /**
         * メッセージの間隔(px)
         * @type {number}
         * @private
         */
        this.msgPadding_ = 20;

        /**
         * メッセージを表示する時間(msec)
         * @type {number}
         * @private
         */
        this.msgTime_ = 9000;
    },

    /**
     * @param {string} msg
     */
    addMsg: function(msg) {
        var msgEl = $('<div/>').html(msg).addClass('bq-instant-msg-item');
        var top = 0;
        if (this.msgs_[0]) {
            top = parseInt(this.msgs_[0].css('bottom'), 10) + this.msgPadding_;
        }
        msgEl.css('bottom', top);
        this.msgs_.unshift(msgEl);
        this.inner_.append(msgEl);
        msgEl.animate({left: 0}, 250);
        setTimeout(_.bind(function() {
            msgEl.animate({left: '-200px', opacity: 0}, 250, 'swing', _.bind(function() {
                this.msgs_ = _.without(this.msgs_, msgEl);
                this.updateLayout_();
                msgEl.remove();
            }, this));
        }, this), this.msgTime_);
    },

    updateLayout_: function() {
        var gainPadding = this.msgPadding_;
        var oldestMsg = _.last(this.msgs_);
        if (oldestMsg) {
            gainPadding = parseInt(oldestMsg.css('bottom'), 10);
        }
        _.forEach(this.msgs_, _.bind(function(msg) {
            var currentBottom = parseInt(msg.css('bottom'), 10);
            msg.animate({'bottom': currentBottom - gainPadding + 'px'}, 200);
        }, this));
    }
});