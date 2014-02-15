/**
 * レベル表示
 * @constructor
 */
bq.hud.Level = bq.hud.HudItem.extend({
    ctor: function() {
        this.container_ = $('#bq-level');
    },

    /**
     * @param {number} level
     */
    initLevel: function(level) {
        this.container_.text('Lv' + level);
    }
});