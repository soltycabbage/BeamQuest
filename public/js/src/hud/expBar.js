/**
 * 経験値バー
 * @constructor
 */
bq.hud.ExpBar = bq.hud.HudItem.extend({
    ctor: function() {
        this.container_ = $('#bq-exp-bar');
        this.valueBar_ = $('#bq-exp-bar-value');
    },

    /** @override */
    enable: function(enabled) {
        this.container_.hide(enabled);
    },

    /**
     * @param {number} currentExp
     * @param {number} nextExp
     */
    updateExpBar: function(currentExp, nextExp) {
        var ratio = Math.floor(currentExp / nextExp * 100);
        this.valueBar_.width(ratio + '%');
        this.container_.infoBox({
            content: 'EXP.' + currentExp + '/' + nextExp + '(' + ratio + '%)'
        });
    }
});