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
     * @param {number} prevExp
     * @param {number} currentExp
     * @param {number} nextExp
     */
    updateExpBar: function(prevExp, currentExp, nextExp) {
        var s = nextExp - prevExp;
        var k = currentExp - prevExp;
        var ratio = Math.floor(k / s * 100);
        this.valueBar_.width(ratio + '%');
        this.container_.infoBox({
            content: 'EXP.' + k + '/' + s + '(' + ratio + '%)'
        });
    }
});