var Player = Entity.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    animationSpeed:0.15, // delay on animation
    ctor:function () {
        this._super('b0_0.png');
        this.initAnimation_();
    },

    /**
     * アニメーションを設定する
     * @private
     */
    initAnimation_: function() {
        var frameCache = cc.SpriteFrameCache.getInstance();

        var animation = cc.Animation.create();
        for (var i = 0; i < 7; i++) {
            var str = "b0_" + i + ".png";
            var frame = frameCache.getSpriteFrame(str);
            animation.addSpriteFrame(frame);
        }
        animation.setDelayPerUnit(this.animationSpeed); 

        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        this.runAction(forever);
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
       this.name = data.name;
    }
 

});
