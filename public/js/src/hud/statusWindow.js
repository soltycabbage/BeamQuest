/**
 * ステータスウィンドウ
 * @constructor
 */
bq.hud.StatusWindow = bq.hud.HudItem.extend({
    ctor: function() {
        /**
         * @type {Element}
         * @private
         */
        this.container_ = null;
    },

    /**
     * @param {string} entityId
     */
    open: function(entityId) {
        bq.Socket.getInstance().requestEntityStatus(entityId, function(data) {
            this.render_(data);

            $('#bq-status-window').dialog(
                {
                    'title': 'CHARACTER',
                    'dialogClass': 'bq-status-dialog',
                    'width': 600,
                    'height': 360,
                    'close': this.close
                }
            );

        }, this);
    },

    /**
     * EJSからHTMLを作ってレンダリングする
     * @param {Object} model
     * @private
     */
    render_: function(model) {
        this.close();
        var statusEjs = new EJS({url: '../ejs/statusWindow.ejs'});
        var statusHtml = statusEjs.render(model);
        this.container_ = $(statusHtml);
        $('#bq-hud').append(this.container_);
    },

    /**
     * ウィンドウを閉じる
     * @private
     */
    close: function() {
        if (this.container_) {
            this.container_.remove();
        }
    }
});