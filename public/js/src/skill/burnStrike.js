bq.skill.BurnStrike = bq.skill.extend({
    /** @override */
    fire: function() {
        var deferred = new $.Deferred();
        var promise = this.fireShot_(deferred);
        promise.done(_.bind(this.areaOfEffect_, this));
    },

    /**
     * 火の玉を飛ばす
     * @param {Deferred} deferred
     * @private
     */
    fireShot_: function(deferred) {
        var fireBall = cc.Sprite.create();
        var particle = cc.ParticleSun.create();
        var texture = cc.textureCache.textureForKey(s_ImgParticleSmoke);
        particle.setTexture(texture);
        particle.setPosition(cc.p(0, 0));

        fireBall.setPosition(cc.p(this.user.x, this.user.y));
        fireBall.addChild(particle);
        fireBall.runAction(
            cc.Sequence.create(
                cc.JumpTo.create(0.5, cc.p(this.targetPos.x, this.targetPos.y), 50, 1),
                cc.CallFunc.create(function() {
                    deferred.resolve();
                    fireBall.removeFromParent();
                })
            )
        );

        bq.baseLayer.addChild(fireBall, bq.config.zOrder.GROUND_EFFECT);
        return deferred.promise();
    },

    /**
     * 炎の床（継続ダメージ）を生成する
     * @private
     */
    areaOfEffect_: function() {
           /* var explode = cc.ParticleSystem.create(s_PlistEffectExplode);
            explode.setPosition(cc.p(0,0));
            explode.setStartColor(cc.color(1, 0, 0, 1));
            var batch = cc.ParticleBatchNode.create();
            batch.setPosition(cc.p(this.targetPos.x, this.targetPos.y));
            batch.setTexture(explode.getTexture());
            batch.addChild(explode);
            bq.baseLayer.addChild(batch, bq.config.zOrder.PLAYER - 2);
    */

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
        var removeFunc = cc.CallFunc.create(function() {
            burn.removeFromParent();
        });
        burn.setOpacity(0);
        burn.runAction(
            cc.Spawn.create(
                cc.FadeIn.create(0.3, 255),
                cc.Repeat.create(cc.Animate.create(animation), 100),
                cc.Sequence.create(cc.DelayTime.create(5), cc.FadeOut.create(1), removeFunc)
        ));

        bq.baseLayer.addChild(burn, bq.config.zOrder.GROUND_EFFECT);
    }
});
