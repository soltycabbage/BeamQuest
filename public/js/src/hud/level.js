/**
 * レベル表示
 * @constructor
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