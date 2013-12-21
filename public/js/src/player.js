var Player = Entity.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    animationSpeed:0.15, // delay on animation
    direction: Direction.bottom, // 向いている方向
    state:Status.stop, // 動いてるとか止まってるとかの状態
    ctor:function () {
        this._super('b0_0.png');
        this.initAnimation_();
    },

    /**
     * アニメーションを設定する
     * @private
     */
    initAnimation_: function() {
        var animation = this.createAnimation_(this.direction, this.state);
        this.runAction(animation);
    },

    /**
     * ある状態である方向のアニメーションを作成する
     * @param {Direction} dir 向き
     * @param {Status} sts 状態
     */
    createAnimation_: function (dir, sts) {
        if ( dir > Direction.maxDirection ) {
            return null;
        }
        var frameCache = cc.SpriteFrameCache.getInstance();
        var animation = cc.Animation.create();

        // 0〜3が止まってる絵、4〜7が歩いている絵
        var starti = (sts == Status.stop) ? 0:3;
        var endi = (sts == Status.stop) ? 3:7;

        for (var i = starti; i <= endi; i++) {
            var str = "b" + dir +"_" + i + ".png";
            var frame = frameCache.getSpriteFrame(str);
            animation.addSpriteFrame(frame);
        }
        animation.setDelayPerUnit(this.animationSpeed);

        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        return forever;
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
       this.name = data.name;
    }
 

});

var Status = {
    stop:0,
    walking:1,
    maxStatus:2
};

var Direction = {
    bottom:0,
    left:1,
    top:2,
    right:3,
    maxDirection:4
};