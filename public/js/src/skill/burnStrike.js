bq.skill.BurnStrike = bq.skill.extend({
    /** @override */
    fire: function() {
        cc.spriteFrameCache.addSpriteFrames(s_PlistEffectBurn, s_ImgEffectBurn);
        var burn = cc.Sprite.create();
        var frames = [];
        for (var i = 0;i < 4; i++) {
            frames.push('burn' + i + '.png');
        }
        burn.initWithSpriteFrameName(frames[0]);
        var animation = cc.Animation.create();
        animation.setDelayPerUnit(0.1);

        _.forEach(frames, function (i) {
            var frame = cc.spriteFrameCache.getSpriteFrame(i);
            animation.addSpriteFrame(frame);
        }, this);
        burn.setPosition(cc.p(this.targetPos.x, this.targetPos.y));
        burn.runAction(cc.RepeatForever.create(cc.Animate.create(animation)));
        bq.baseLayer.addChild(burn, bq.config.zOrder.PLAYER - 2);
    }
});
