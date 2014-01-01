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
    beamId:[2], // 装備しているビームのID

    ctor:function () {
        this._super('b0_0.png', this.getKeyFrameMap_());
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
        var absolPos = this.convertAbsolutePosition(this.getPosition());
        var posData = {
            userId: this.name,
            mapId: 1, // TODO: MapID の実装
            x: absolPos.x,
            y: absolPos.y
        };

        // 前回送信時と位置が変わってなかったら送信しない
        if (this.prevPos_.mapId === posData.mapId && this.prevPos_.x === posData.x && this.prevPos_.y === posData.y) {
            return;
        }
        this.prevPos_.mapId = posData.mapId;
        this.prevPos_.x = posData.x;
        this.prevPos_.y = posData.y;
        this.socket.sendPlayerPosition(posData);
    },

    /**
     * 引数に与えられた座標をbaseLayerから見た座標に変換して返す
     * @param {cc.p} src
     * @return {Object}
     */
    convertAbsolutePosition: function(src) {
        var baseLayerP = bq.baseLayer.getPosition();
        return {
            x: src.x - baseLayerP.x,
            y: src.y - baseLayerP.y
        };
    },



    /**
     * ある状態である方向のアニメーションを作成する
     * @param {bq.entity.EntityState.Direction} dir 向き
     * @param {bq.entity.EntityState.Mode} sts 状態
     * @private
     * @return {cc.Animation}
     */


    /**
     * destination までビームを出す
     *
     * @param {cc.p} destination
     */
    shoot: function(destination) {
        // BPが残ってるかチェック

        //撃てるならBPを減らす

        // プリロードされているビームを取り出して打つ
        var b = bq.Beam.pop();
        if ( b == null ) {
            // TODO どうする？？
        } else {
            this.shootInternal_(b, destination);
        }
    },

    /**
     * サーバに伝えてからビーム発射
     * @param {bq.Beam} beam
     * @param {cc.p} destination
     * @private
     */
    shootInternal_: function(beam, destination) {
        var src = this.convertAbsolutePosition(this.getPosition());
        var dest = this.convertAbsolutePosition(destination);

        var json = { // TODO モデル化したい気持ち
            userId: this.name,
            mapId: 1, // TODO mapId
            src: {x: src.x, y: src.y},
            dest: {x: dest.x, y: dest.y},
            beamId: this.beamId[0]
        };

        this.socket.shootBeam(json);
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
        this.name = data.name;
    },

    getKeyFrameMap_: function() {
        return  {
            idle_bottom: ["b0_0.png", "b0_1.png", "b0_2.png", "b0_3.png"],
            idle_bottomright: ["b1_0.png", "b1_1.png", "b1_2.png", "b1_3.png"],
            idle_right: ["b2_0.png", "b2_1.png", "b2_2.png", "b2_3.png"],
            idle_topright: ["b3_0.png", "b3_1.png", "b3_2.png", "b3_3.png"],
            idle_top: ["b4_0.png", "b4_1.png", "b4_2.png", "b4_3.png"],
            idle_topleft: ["b5_0.png", "b5_1.png", "b5_2.png", "b5_3.png"],
            idle_left: ["b6_0.png", "b6_1.png", "b6_2.png", "b6_3.png"],
            idle_bottomleft: ["b7_0.png", "b0_1.png", "b0_2.png", "b0_3.png"],

            step_bottom: ["b0_4.png", "b0_5.png", "b0_6.png", "b0_7.png"],
            step_bottomright: ["b1_4.png", "b1_5.png", "b1_6.png", "b1_7.png"],
            step_right: ["b2_4.png", "b2_5.png", "b2_6.png", "b2_7.png"],
            step_topright: ["b3_4.png", "b3_5.png", "b3_6.png", "b3_7.png"],
            step_top: ["b4_4.png", "b4_5.png", "b4_6.png", "b4_7.png"],
            step_topleft: ["b5_4.png", "b5_5.png", "b5_6.png", "b5_7.png"],
            step_left: ["b6_4.png", "b6_5.png", "b6_6.png", "b6_7.png"],
            step_bottomleft: ["b7_4.png", "b7_5.png", "b7_6.png", "b7_7.png"]
        };
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
            this.player_.setAnimation(bq.entity.EntityState.Mode.walking,dir);
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
                this.player_.setAnimation(sts,dir);
                break;
            case cc.KEY.s:
            case cc.KEY.w:
                this.dy = 0;
                var dir = this.convertDirectionFromKeys_(this.downKeys_);
                var sts = (this.downKeys_.length == 0) ? bq.entity.EntityState.Mode.stop : null;
                this.player_.setAnimation(sts,dir);
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

        return found.val;
    }

});

