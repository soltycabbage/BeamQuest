/**
 * HUD
 * @constructor
 */
bq.Hud = cc.Class.extend({
    ctor: function() {
        this.container_ = $('#bq-hud');
        this.hpBpBar_ = new bq.hud.HpBpBar();
    },

    enable: function(enabled) {
        if (enabled) {
            this.container_.show();
        } else {
            this.container_.hide();
        }

    },

    updateHpBar: function(currentHp, player) {
        this.hpBpBar_.updateHpBar(currentHp, player);
    },

    initHpBar: function(currentHp, maxHp) {
        this.hpBpBar_.initHpBar(currentHp, maxHp);
    }
});


bq.Hud.instance_ = new bq.Hud();
bq.Hud.getInstance = function() {
    return bq.Hud.instance_;
};

bq.hud = cc.Class.extend({});
