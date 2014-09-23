/**
 * レベル表示
 * @class
 * @extends bq.hud.HudItem
 */
bq.hud.Level = bq.hud.HudItem.extend({
    ctor: function() {
        this.container_ = $('#bq-level');
        this.value_ = $('#bq-level-value');
    },

    /**
     * @param {number} level
     */
    initLevel: function(level) {
        this.value_.text(level);
    }
});