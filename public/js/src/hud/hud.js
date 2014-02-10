/**
 * HUD
 * @constructor
 */
bq.Hud = cc.Node.extend({
    ctor: function() {
        this.container_ = $('#bq-hud');
        this.hpBpBar_ = new bq.hud.HpBpBar();
        this.expBar_ = new bq.hud.ExpBar();
    },

    /**
     * プレイヤーからの各種イベントを受け取るために初期化する
     * @param {bq.entity.Player} player
     */
    initPlayer: function(player) {
        $(player).on(bq.entity.Player.EventType.INIT_HP, _.bind(this.handleInitHp_, this));
        $(player).on(bq.entity.Player.EventType.UPDATE_HP, _.bind(this.handleUpdateHp_, this));
        $(player).on(bq.entity.Player.EventType.UPDATE_EXP, _.bind(this.handleUpdateExp_, this));
    },

    enable: function(enabled) {
        if (enabled) {
            this.container_.show();
        } else {
            this.container_.hide();
        }
    },

    /**
     * @param {Event} evt
     * @param {number} currentHp
     * @param {bq.model.Player} playerModel
     * @private
     */
    handleUpdateHp_: function(evt, currentHp, playerModel) {
        this.hpBpBar_.updateHpBar(currentHp, playerModel);
    },

    /**
     * @param {Event} evt
     * @param {number} currentHp
     * @param {number} maxHp
     * @private
     */
    handleInitHp_: function(evt, currentHp, maxHp) {
        this.hpBpBar_.initHpBar(currentHp, maxHp);
    },


    /**
     * @param {Event} evt
     * @param {number} currentExp
     * @param {number} nextExp
     * @private
     */
    handleUpdateExp_: function(evt, currentExp, nextExp) {
        this.expBar_.updateExpBar(currentExp, nextExp);
    }
});


bq.Hud.instance_ = new bq.Hud();
bq.Hud.getInstance = function() {
    return bq.Hud.instance_;
};

bq.hud = cc.Class.extend({});
