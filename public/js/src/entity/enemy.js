bq.Enemy = Entity.extend({
    animationSpeed:0.15,         // delay on animation
    ctor:function (enemy_id) {
        'use strict';
        this.enemy_id_ = String('00' + enemy_id).slice(-3); // NOTE sprintf('%03d')
        this._super(this.getSpriteFrame_(1));
        this.runAction(this.createSteppingAnimation());
        this.scheduleUpdate();
    },

    createSteppingAnimation: function() {
        'use strict';
        var keyFrames = this.getSteppingAnimationKeyFrames_();
        var animation = this.buildSimpleAnimationByKeyFrames_(keyFrames);
        return cc.RepeatForever.create(cc.Animate.create(animation));
    },

    getSteppingAnimationKeyFrames_: function() {
        return [1, 2, 3, 4];
    },

    buildSimpleAnimationByKeyFrames_: function(keyFrames) {
        var animation = cc.Animation.create();
        animation.setDelayPerUnit(this.animationSpeed);

        var frameCache = cc.SpriteFrameCache.getInstance();
        _.forEach(keyFrames, function(i) {
            var frame = frameCache.getSpriteFrame(this.getSpriteFrame_(i));
            animation.addSpriteFrame(frame);
        }, this);
        return animation;
    },

    getSpriteFrame_: function(frame_no) {
        'use strict';
        var no = String('0' + frame_no).slice(-2); // NOTE sprintf('%02d')
        return 'enemy' + this.enemy_id_ + '_' + no + '.png';
    },
});
