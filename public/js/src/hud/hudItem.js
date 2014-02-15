/**
 * HUDの構成要素の基底クラス
 * @constructor
 */
bq.hud = {};
bq.hud.HudItem = cc.Node.extend({
    ctor: function() {
        /**
         * @type {jQuery.Element}
         * @protected
         */
        this.container_;
    },

    /**
     * @param {boolean} enabled
     * @protected
     */
    enable: function(enabled) {
        if (this.container_) {
            this.container_.hide(enabled);
        }
    }
});