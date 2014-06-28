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
         * メッセージの挿入位置(px)
         * @type {number}
         * @private
         */
        this.msgBottom_ = 0;

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
        this.msgTime_ = 5000;
    },

    /**
     * @param {string} msg
     */
    addMsg: function(msg) {
        var msgEl = $('<div/>').html(msg).addClass('bq-instant-msg-item');
        msgEl.css('bottom', this.msgBottom_ + this.msgs_.length * this.msgPadding_);
        this.msgs_.unshift(msgEl);
        this.inner_.append(msgEl);
        msgEl.animate({left: 0}, 250);
        setTimeout(_.bind(function() {
            msgEl.animate({left: '-200px', opacity: 0}, 250, 'swing', _.bind(function() {
                this.msgs_ = _.without(this.msgs_, msgEl);
                this.updateLayout_();
            }, this));
        }, this), this.msgTime_);
    },

    updateLayout_: function() {
        if (this.msgBottom_ > 0) {
            this.msgBottom_ -= this.msgPadding_;
        }
        _.forEach(this.msgs_, _.bind(function(msg) {
            var currentBottom = parseInt(msg.css('bottom'), 10);
            msg.animate({'bottom': currentBottom - this.msgPadding_ + 'px'}, 200);
        }, this));
    }
});