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
    },

    /**
     * @param {string} msg
     */
    addMsg: function(msg) {
        var msgEl = $('<div/>').html(msg).addClass('bq-instant-msg-item');
        msgEl.css('bottom', this.msgBottom_ + this.msgs_.length * this.msgPadding_);
        this.msgs_.unshift(msgEl);
        this.inner_.append(msgEl);
        this.updateLayout_();
    },

    updateLayout_: function() {
        _.forEach(this.msgs_, function(msg) {

        });
    }
});