/**
 * HUDの構成要素の基底クラス
 * @constructor
 */
bq.hud = {};
bq.hud.HudItem = cc.Node.extend({
    /**
     * @param {boolean} enabled
     * @protected
     */
    enable: function(enabled) {
        // must override
    }
});