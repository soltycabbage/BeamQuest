var Status = {
    stop:0,
        walking:1,
        maxStatus:2
};
var Direction = {
    bottom: 0,
    bottomright:1,
    right: 2,
    topright:3,
    top: 4,
    topleft:5,
    left: 6,
    bottomleft: 7,
    maxDirection: 8
};
var Player = Entity.extend({

    moveSpeed: 2, // 1frameの移動量(px)
    animationSpeed:0.15, // delay on animation
    direction: Direction.bottom, // 向いている方向
    state: Status.stop, // 動いてるとか止まってるとかの状態

    ctor:function () {
        this._super('b0_0.png');
        //this.updateAnimation(null,null);
    },

    /**
     * 向きと状態を更新してそれにもとづいてアニメーションを更新する
     * @param {Direction} dir 向き (nullなら更新しない）
     * @param {Status} sts 状態 (nullなら更新しない）
     */
    updateAnimation: function(dir, sts) {
        // 同じだったら更新しない
        if ( this.direction != dir || this.state != sts ) {
            this.direction = dir == null ? this.direction : dir;
            this.state = sts == null ? this.state : sts;

            // TODO 毎回作りなおさずキャッシュする
            var animation = this.createAnimation_(this.direction, this.state);
            if ( this.getNumberOfRunningActions() > 0 ) {
                this.stopAllActions();
            }
            this.runAction(animation);
        }
    },

    /**
     * ある状態である方向のアニメーションを作成する
     * @param {Direction} dir 向き
     * @param {Status} sts 状態
     * @private
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
        //cc.log("dir " + dir + " sts " + sts);
        // TODO underscore.js を使って書き直す
        for (var i = starti; i <= endi; i++) {
            var str = "b" + dir +"_" + i + ".png";
            //cc.log(str);
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

