/**
 * @fileoverview プライヤー
 */

/**
 *
 * @type {*|void|Object|Function}
 */
var Player = Entity.extend({
    moveSpeed: 4,                // 1frameの移動量(px)
    animationSpeed:0.15,         // delay on animation
    direction: EntityState.Direction.bottom, // 向いている方向
    state:EntityState.Mode.stop,           // 動いてるとか止まってるとかの状態
    POSITION_SEND_INTERVAL: 5,   // 位置情報を何frameごとに送信するか
    positionSendCount_: 0,       // 位置情報送信用カウンター
    prevPos_: {x: 0, y: 0},      // 前回送信時の座標
    beamId:[0], // 装備しているビームのID

    ctor:function () {
        this._super('b0_0.png');
        this.socket = bq.Socket.getInstance();
        this.scheduleUpdate();
    },

    /** @override */
    update: function() {
        if (this.positionSendCount_++ > this.POSITION_SEND_INTERVAL) {
            this.positionSendCount_ = 0;
            this.sendPosition();
        }
    },

    /**
     * 自分の現在座標をサーバに送信する
     */
    sendPosition: function() {
        if (!bq.baseLayer) {return;}
        var playerP = this.getPosition();
        var baseLayerP = bq.baseLayer.getPosition();

        var abslPos = {
            userId: this.name,
            mapId: 1, // TODO: MapID の実装
            x: playerP.x - baseLayerP.x,
            y: playerP.y - baseLayerP.y
        }

        // 前回送信時と位置が変わってなかったら送信しない
        if (this.prevPos_.mapId === abslPos.mapId && this.prevPos_.x === abslPos.x && this.prevPos_.y === abslPos.y) {
            return;
        }
        this.prevPos_.mapId = abslPos.mapId;
        this.prevPos_.x = abslPos.x;
        this.prevPos_.y = abslPos.y;
        this.socket.sendPlayerPosition(abslPos);
    },

    /**
     * 向きと状態を更新してそれにもとづいてアニメーションを更新する
     * @param {EntityState.Direction} dir 向き (nullなら更新しない）
     * @param {EntityState.Mode} sts 状態 (nullなら更新しない）
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
     * @param {EntityState.Mode} sts 状態
     * @private
     * @returns {cc.Animation}
     */
    createAnimation_: function (dir, sts) {

        if ( dir > EntityState.Direction.maxDirection ) {
            return null;
        }
        var frameCache = cc.SpriteFrameCache.getInstance();
        var animation = cc.Animation.create();

        // 0〜3が止まってる絵、4〜7が歩いている絵
        var starti = (sts == EntityState.Mode.stop) ? 0:4;
        var endi = (sts == EntityState.Mode.stop) ? 3:7;
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
     * destination までビームを出す
     *
     * @param {cc.p} destination
     */
    shoot: function( destination) {
        var curr = this.getPosition();
        var diff = cc.p((destination.x-curr.x), (destination.y-curr.y));

        // BPが残ってるかチェック

        //撃てるならBPを減らす

        // プリロードされているビームを取り出して打つ
        var b = Beam.pop();
        if ( b == null ) {
            // TODO どうする？？
        } else {
            b.initDestination(diff);
            b.setPosition(0,0);
        }
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
       this.name = data.name;
    }
});
