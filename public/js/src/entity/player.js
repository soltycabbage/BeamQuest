/**
 * @fileoverview プライヤー
 */

/**
 * @constructor
 * @extends {bq.Entity}
 */
bq.entity.Player = bq.entity.Entity.extend({
    moveSpeed: 4,                // 1frameの移動量(px)
    animationSpeed:0.15,         // delay on animation
    direction: bq.entity.EntityState.Direction.bottom, // 向いている方向
    state: bq.entity.EntityState.Mode.stop,           // 動いてるとか止まってるとかの状態
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
     * @param {bq.entity.EntityState.Direction} dir 向き (nullなら更新しない）
     * @param {bq.entity.EntityState.Mode} sts 状態 (nullなら更新しない）
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
     * @param {bq.entity.EntityState.Direction} dir 向き
     * @param {bq.entity.EntityState.Mode} sts 状態
     * @private
     * @return {cc.Animation}
     */
    createAnimation_: function (dir, sts) {

        if ( dir > bq.entity.EntityState.Direction.maxDirection ) {
            return null;
        }
        var frameCache = cc.SpriteFrameCache.getInstance();
        var animation = cc.Animation.create();

        // 0〜3が止まってる絵、4〜7が歩いている絵
        var starti = (sts == bq.entity.EntityState.Mode.stop) ? 0:4;
        var endi = (sts == bq.entity.EntityState.Mode.stop) ? 3:7;
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
        var b = bq.Beam.pop();
        if ( b == null ) {
            // TODO どうする？？
        } else {
            cc.AudioEngine.getInstance().playEffect(s_SeBeamA);
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

bq.entity.Player.InputHandler = cc.Class.extend({
    downKeys_: [], // 今押されているキーのリスト (max2)
    dx: 0, // プレイヤーx方向移動量(px)
    dy: 0, // プレイヤーy方向移動量(px)

    ctor: function(player) {
        this.player_ = player;
    },

    /** @override */
    onKeyDown: function(key) {

        var startWalking = function(dx, dy) {
            this.dx = dx;
            this.dy = dy;
            this.addDownKey_(key);
            var dir = this.convertDirectionFromKeys_(this.downKeys_);
            this.player_.updateAnimation(dir, bq.entity.EntityState.Mode.walking);
        }.bind(this);

        switch (key) {
            // 重複多いのでリファクタリングした結果ｗｗｗｗｗ
            case cc.KEY.a:
                startWalking(this.player_.moveSpeed, this.dy);
                break;

            case cc.KEY.s:
                startWalking(this.dx, this.player_.moveSpeed);
                break;

            case cc.KEY.d:
                startWalking(-this.player_.moveSpeed, this.dy);
                break;

            case cc.KEY.w:
                startWalking(this.dx, -this.player_.moveSpeed);
                break;

            default:
                break;
        }
    },

    /** @override */
    onKeyUp: function(key) {
        this.removeDownKey_(key);

        if (this.downKeys_.length > 0) {
            // return;
            // TODO: 移動で引っかかるのをどうにかする
        }
        switch (key) {
            case cc.KEY.a:
            case cc.KEY.d:
                this.dx = 0;
                // 押しているキーが０でない場合まだ歩いている
                var sts = (this.downKeys_.length == 0) ? bq.entity.EntityState.Mode.stop : null;
                var dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, sts);
                break;
            case cc.KEY.s:
            case cc.KEY.w:
                this.dy = 0;
                var dir = this.convertDirectionFromKeys_(this.downKeys_);
                var sts = (this.downKeys_.length == 0) ? bq.entity.EntityState.Mode.stop : null;
                this.player_.updateAnimation(dir, sts);
                break;
            default:
                break;
        }
    },

    /**
     * 同時押し時に滑らかに移動させたいので現在押されているキーをリストに登録して管理する
     * @param {Event} key
     * @private
     */
    addDownKey_: function(key) {
        if (!_.contains(this.downKeys_, key) && this.downKeys_.length < 2) {
            this.downKeys_.push(key);
        }
    },

    /**
     *
     * @param event
     */
    onMouseDown: function(event) {
        // TODO 右クリックと左クリックで動作を変える
        this.player_.shoot(event.getLocation());
    },

    /**
     * @param {Event} key
     * @private
     */
    removeDownKey_: function(key) {
        this.downKeys_ = _.without(this.downKeys_, key);
    },

    /**
     * キー押したやつから方向に変換
     * @param {Array} downs
     * @return {bq.entity.EntityState.Direction} 見つからない場合null
     */
    convertDirectionFromKeys_: function(downs) {
        var pairs = [
            {key: [cc.KEY.s], val: bq.entity.EntityState.Direction.bottom},
            {key: [cc.KEY.s,cc.KEY.d], val: bq.entity.EntityState.Direction.bottomright},
            {key: [cc.KEY.d], val: bq.entity.EntityState.Direction.right},
            {key: [cc.KEY.d, cc.KEY.w], val: bq.entity.EntityState.Direction.topright},
            {key: [cc.KEY.w], val: bq.entity.EntityState.Direction.top},
            {key: [cc.KEY.w, cc.KEY.a], val: bq.entity.EntityState.Direction.topleft},
            {key: [cc.KEY.a], val: bq.entity.EntityState.Direction.left},
            {key: [cc.KEY.a, cc.KEY.s], val: bq.entity.EntityState.Direction.bottomleft},
            {key: [cc.KEY.a, cc.KEY.d], val: null},
            {key: [cc.KEY.w, cc.KEY.s], val: null}
        ];

        if ( downs.length == 0 ) {
            // 押してない状態はnull (向いてる方向を維持）
            return null;
        }

        var found = _.find(pairs, function(pair) {
            return ( downs.length==1 && _.contains(downs, pair.key[0]) )
                || ( downs.length==2 && _.contains(downs, pair.key[0]) && _.contains(downs, pair.key[1]) );
        } );

         found.val;
    }
});

