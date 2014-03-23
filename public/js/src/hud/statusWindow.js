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
     * @param {bq.entity.Entity}
     */
    open: function(entity) {
        this.render_(entity);

        $('#bq-status-window').dialog(
            {
                'title': 'CHARACTER',
                'dialogClass': 'bq-status-dialog',
                'width': 600,
                'height': 360,
                'close': this.close
            }
        );
    },

    /**
     * EJSからHTMLを作ってレンダリングする
     * @param {bq.entity.Entity} entity
     * @private
     */
    render_: function(entity) {
        this.close();
        var statusEjs = new EJS({url: '../ejs/statusWindow.ejs'});
        var statusHtml = statusEjs.render({
            playerName: entity.name,
            level: entity.getModel().lv,
            job: 'すっぴん',
            attack: 10,
            defence: 5,
            con: 10
        });
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