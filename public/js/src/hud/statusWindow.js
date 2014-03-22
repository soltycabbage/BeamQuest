/**
 * ステータスウィンドウ
 * @constructor
 */
bq.hud.StatusWindow = bq.hud.HudItem.extend({
    ctor: function() {

    },

    /**
     * @param {bq.entity.Entity}
     */
    open: function(entity) {
        this.render_(entity);

        $('#bq-status-window').dialog(
            {
                'title': 'ステータス',
                'dialogClass': 'bq-status-dialog',
                'width': 600,
                'height': 360
            }
        );
    },

    render_: function(entity) {
        var statusEjs = new EJS({url: '../ejs/statusWindow.ejs'});
        var statusHtml = statusEjs.render({playerName: entity.name});
        var statusEl = $(statusHtml);
        $('#bq-hud').append(statusEl);
    }
});