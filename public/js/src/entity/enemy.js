/**
 * @constructor
 * @extends {bq.entity.Entity}
 */
bq.entity.Enemy = bq.entity.Entity.extend({
    idlingAnimationSpeed: 0.15, // delay on animation
    isAttacking: false,
    enemy_id_: 0, // enemy_id
    ctor: function (enemy_image_id) {
        'use strict';
        this.enemy_id_ = String('00' + enemy_image_id).slice(-3); // NOTE sprintf('%03d')
        this._super(this.getSpriteFrame_(1), this.getKeyFrameMap_());

        this.animations['atacking_bottom'] = this.createAttackingAnimation();
        this.updateAnimation(bq.entity.EntityState.Mode.stop, bq.entity.EntityState.Direction.bottom);

        this.scheduleUpdate();
    },

    update: function () {
        if (!this.isAttacking) {
            // 1%の確率で攻撃モーション(適当)
            if (Math.random() < 0.01) {
                this.isAttacking = true;
                this.updateAnimation('atacking' , bq.entity.EntityState.Direction.bottom);
            }
        }
    },

    /** @override */
    kill: function(opt_skipRemove, opt_callback) {
        this._super(opt_skipRemove, opt_callback);
        this.targetLine_ && this.targetLine_.removeFromParent();
    },

    /**
     * タゲったらニョーンってラインを伸ばす
     * @param {bq.entity.Entity} target
     */
    targetTo: function(target) {
        this.targetLine_ = new bq.entity.TargetLine(this, target);
        this.targetLine_.drawLine();
    },

    createAttackingAnimation: function() {
        var vibrate = bq.entity.Animation.createAnimation(this.getSpriteFrames_([5,6]));
        vibrate.setDelayPerUnit(0.1);
        vibrate.setLoops(5);
        var bite = bq.entity.Animation.createAnimation(this.getSpriteFrames_([7,8]));
        bite.setDelayPerUnit(0.5);
        return new cc.Sequence([
            new cc.Animate(vibrate),
            new cc.Animate(bite),
            new cc.CallFunc(function(){
                // アタックのモーションとったら元に戻す
                this.isAttacking = false;
                this.updateAnimation('idle', 'bottom');
            }, this)
        ]);
    },

    getSpriteFrame_: function (i) {
        'use strict';
        var no = String('0' + i).slice(-2); // NOTE sprintf('%02d')
        return 'enemy' + this.enemy_id_ + '_' + no + '.png';
    },


    getSpriteFrames_: function (ids) {
        'use strict';
        return _.map(ids,
            this.getSpriteFrame_, this);
    },

    getKeyFrameMap_: function () {
        'use strict';
        var frames = {};
        var idleIds = [1,2,3,4];
        _.each(['idle_bottom'], function (sts) {
            frames[sts] = this.getSpriteFrames_(idleIds);
        }, this);

        return frames;
    }
});
