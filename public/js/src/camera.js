bq.Camera = cc.Class.extend({
    ctor: function(follower) {
        this.follower_ = follower;
    },

    lookAt: function(target) {
        var follow = cc.Follow.create(target);
        this.follower_.runAction(follow);
    },

    /**
     * window座標系をゲーム内座標系に変換して返す
     * @param {cc.p} src
     * @return {cc.p}
     */
    convertWindowPositionToWorldPosition: function(src) {
        var basePosition = this.follower_.getPosition();
        return cc.p(src.x - basePosition.x, src.y - basePosition.y);
    }
});

