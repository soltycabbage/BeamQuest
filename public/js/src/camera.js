bq.Camera = cc.Class.extend({
    ctor: function(follower) {
        /**
         * カメラに追わせたいNode
         * @type {cc.Node}
         * @private
         */
        this.follower_ = follower;

        /**
         * followアクション
         * @type {cc.Follow}
         * @private
         */
        this.followAct_;
    },

    lookAt: function(target) {
        var follow = new cc.Follow(target);
        this.follower_.runAction(follow);
        this.followAct_ = follow;
    },

    /**
     * 任意のタイミングでカメラを動かしたい時に呼ぶ
     */
    forceLook: function() {
        this.followAct_ && this.followAct_.step();
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

