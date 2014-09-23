/**
 * 経験値バー
 * @class
 * @extends bq.hud.HudItem
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
     * @param {number} prevLvExp
     * @param {number} currentExp
     * @param {number} nextLvExp
     */
    updateExpBar: function(prevLvExp, currentExp, nextLvExp) {
        var s = nextLvExp - prevLvExp;
        var k = currentExp - prevLvExp;
        var ratio = Math.floor(k / s * 100);
        this.valueBar_.width(ratio + '%');
        this.container_.infoBox({
            content: 'EXP.' + k + '/' + s + '(' + ratio + '%)'
        });
    }
});
