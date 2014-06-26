/**
 * HUD
 * @constructor
 */
bq.Hud = cc.Node.extend({
    ctor: function() {
        this.container_ = $('#bq-hud');
        this.hpBpBar_ = new bq.hud.HpBpBar();
        this.expBar_ = new bq.hud.ExpBar();
        this.level_ = new bq.hud.Level();
        this.statusWindow_ = new bq.hud.StatusWindow();
        this.hotBar_ = new bq.hud.HotBar();
    },

    /**
     * プレイヤーからの各種イベントを受け取るために初期化する
     * @param {bq.entity.Player} player
     */
    initPlayer: function(player) {
        $(player).on(bq.entity.Player.EventType.INIT_HP, _.bind(this.handleInitHp_, this));
        $(player).on(bq.entity.Player.EventType.UPDATE_HP, _.bind(this.handleUpdateHp_, this));
        $(player).on(bq.entity.Player.EventType.INIT_BP, _.bind(this.handleInitBp_, this));
        $(player).on(bq.entity.Player.EventType.UPDATE_BP, _.bind(this.handleUpdateBp_, this));
        $(player).on(bq.entity.Player.EventType.UPDATE_EXP, _.bind(this.handleUpdateExp_, this));
        $(player).on(bq.entity.Player.EventType.INIT_LEVEL, _.bind(this.handleInitLevel_, this));
        $(player).on(bq.entity.Player.EventType.SELECT_HOT_BAR, _.bind(this.handleSelectHotBar_, this));
    },

    enable: function(enabled) {
        if (enabled) {
            this.container_.show();
        } else {
            this.container_.hide();
        }
    },

    /**
     * ステータスウィンドウを開く
     * @param {string} entityId
     */
    openStatusWindow: function(entityId) {
        this.statusWindow_.open(entityId);
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
     * @param {number} currentBp
     * @param {bq.model.Player} playerModel
     * @private
     */
    handleUpdateBp_: function(evt, currentBp, playerModel) {
        this.hpBpBar_.updateBpBar(currentBp, playerModel);
    },

    /**
     * @param {Event} evt
     * @param {number} currentBp
     * @param {number} maxHp
     * @private
     */
    handleInitBp_: function(evt, currentBp, maxBp) {
        this.hpBpBar_.initBpBar(currentBp, maxBp);
    },

    /**
     * @param {Event} evt
     * @param {number} prevLvExp
     * @param {number} currentExp
     * @param {number} nextLvExp
     * @private
     */
    handleUpdateExp_: function(evt, prevLvExp, currentExp, nextLvExp) {
        this.expBar_.updateExpBar(prevLvExp, currentExp, nextLvExp);
    },

    /**
     * @param {Event} evt
     * @param {number} level
     * @private
     */
    handleInitLevel_: function(evt, level) {
        this.level_.initLevel(level);
    },

    /**
     * ホットバー選択
     * @param {Event} evt
     * @param {number} selectNumber 0-9の数字
     * @private
     */
    handleSelectHotBar_: function(evt, selectNumber) {
        this.hotBar_.select(selectNumber);
    }
});


bq.Hud.instance_ = new bq.Hud();
bq.Hud.getInstance = function() {
    return bq.Hud.instance_;
};

bq.hud = cc.Class.extend({});
