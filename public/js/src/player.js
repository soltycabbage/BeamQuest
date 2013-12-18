var Player = cc.Node.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    animationSpeed:0.15, // delay on animation
    ctor:function () {
        this._super();
        player = this.createAnimation_();
        this.addChild(player);
    },

    createAnimation_: function() {
        var player = cc.Sprite.createWithSpriteFrameName("b0_0.png");
        var frameCache = cc.SpriteFrameCache.getInstance();

        var animation = cc.Animation.create();
        for (var i = 0; i < 7; i++) {
            var str = "b0_" + i + ".png";
            var frame = frameCache.getSpriteFrame(str);
            animation.addSpriteFrame(frame);
        }
        animation.setDelayPerUnit(this.animationSpeed); 

        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        player.runAction(forever);

        return player;
    }
 

});
