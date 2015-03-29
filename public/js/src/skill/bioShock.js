bq.skill.BioShock = bq.skill.extend({
    /** @override */
    fire: function() {
        this.effect_();
    },


    /**
     * @private
     */
    effect_: function() {
        cc.spriteFrameCache.addSpriteFrames(s_PlistEffectPoison, s_ImgEffectPoison);
        var poison = new cc.Sprite();
        var frames = [];
        for (var i = 0;i < 6; i++) {
            frames.push('poison' + i + '.png');
        }
        poison.initWithSpriteFrameName(frames[0]);
        var animation = new cc.Animation();
        animation.setDelayPerUnit(0.1);

        _.forEach(frames, function (i) {
            var frame = cc.spriteFrameCache.getSpriteFrame(i);
            animation.addSpriteFrame(frame);
        }, this);
        poison.setPosition(cc.p(this.targetPos.x, this.targetPos.y + 24));
        var removeFunc = new cc.CallFunc(function() {
            poison.removeFromParent();
        });

        poison.runAction(
            new cc.Spawn(
                new cc.Sequence(new cc.Animate(animation), new cc.FadeOut(1), removeFunc)
            ));

        bq.baseLayer.addChild(poison, bq.config.zOrder.GROUND_EFFECT);
    }
});
