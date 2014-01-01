bq.Camera = cc.Class.extend({
    ctor: function(follower) {
        this.follower_ = follower;
    },

    lookAt: function(target) {
        var follow = cc.Follow.create(target);
        this.follower_.runAction(follow);
    },
});

