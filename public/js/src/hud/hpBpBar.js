/**
 * HP/BPバー
 * @constructor
 */
bq.hud.HpBpBar = bq.hud.HudItem.extend({
    ctor: function() {
        this.container_ = $('#bq-bar-container');
        this.backGroundHpBar_ = $('#bq-hp-bar-background'); // 外枠
        this.valueHpBar_ = $('#bq-hp-bar-value'); // 赤い部分
        this.valueHpText_ = $('#bq-hp-bar-value-text'); // HPの数値部分
    },

    /** @override */
    enable: function(enabled) {
        this.container_.hide(enabled);
    },

    /**
     * 引数currentHpに指定されたHPになるようにバーを増減させる
     * @param {number} currentHp
     * @param {bq.entity.player} entity
     */
    updateHpBar: function(currentHp, player) {
        var maxWidth = this.backGroundHpBar_.width(); // 最大HP分のバーの長さ
        var resultWidth = Math.floor(maxWidth * currentHp / player.maxHp);
        var gainWidth = this.valueHpBar_.width() - resultWidth + 2;

        var bar = $('#bq-hp-bar');
        if (gainWidth > 0) { // ダメージ
            var gainBar = $('#bq-hp-bar-gain');
            if (gainBar) {
                gainBar.remove();
            }
            gainBar = $('<div/>').attr('id', 'bq-hp-bar-gain');
            gainBar.css('left', this.valueHpBar_.width() - gainWidth + 'px');
            gainBar.width(gainWidth);
            this.backGroundHpBar_.append(gainBar);
            gainBar.animate({width: 0},  {duration: 200, easing: 'swing'});
            this.valueHpBar_.width(resultWidth);
        } else { // 回復
            this.valueHpBar_.animate({width: resultWidth},  {duration: 100, easing: 'swing'});
        }

        this.valueHpText_.text(currentHp + '/' + player.maxHp);
    },

    /**
     * 現在HPにあわせてHPバーを伸縮する
     * @param {numer} currentHp
     * @param {numer} maxHp
     * @private
     */
    initHpBar: function(currentHp, maxHp) {
        var maxWidth = this.backGroundHpBar_.width();
        this.valueHpBar_.width(maxWidth * currentHp / maxHp);
        this.valueHpText_.text(currentHp + '/' + maxHp);
    }
});