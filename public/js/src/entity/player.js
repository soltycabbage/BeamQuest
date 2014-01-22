/**
 * @fileoverview プライヤー
 */

/**
 * @constructor
 * @extends {bq.Entity}
 */
bq.entity.Player = bq.entity.Entity.extend({
    maxMoveSpeed: 6,                         // 1frameの最大移動量(px)
    minMoveSpeed: 1,                         // 歩き始めの移動量
    moveSpeed: 4,                            // 現時点での移動量
    state: bq.entity.EntityState.Mode.stop,  // 動いてるとか止まってるとかの状態
    POSITION_SEND_INTERVAL: 0.15,            // 位置情報を何秒ごとに送信するか
    prevPos_: {x: 0, y: 0},                  // 前回送信時の座標
    beamId:[bq.Types.Beams.FIRE],            // 装備しているビームのID

    ctor:function () {
        this._super('b0_0.png', this.getKeyFrameMap_());
        this.currentDirection = bq.entity.EntityState.Direction.bottom;

        this.socket = bq.Socket.getInstance();
        this.inputHandler = new bq.entity.Player.InputHandler();
        this.scheduleUpdate();
        this.schedule(this.sendPosition, this.POSITION_SEND_INTERVAL);
    },

    /** @override */
    update: function () {
        var direction = this.inputHandler.getDirection();

        if (direction) {
            // アニメーションを更新
            this.updateAnimation(bq.entity.EntityState.Mode.walking, direction);

            // プレイヤーを移動
            var currentPosition = bq.player.getPosition();
            var directionVector = this.getNormalizedDirectionVector(direction);
            var moveDistance = cc.pMult(directionVector, this.moveSpeed);
            var nextPos = cc.pAdd(currentPosition, moveDistance);
            if ( bq.mapManager.canMoveOnMap(nextPos)) {
                this.setPosition(nextPos);
            }
            bq.camera.forceLook();

            if (this.moveSpeed + 1 < this.maxMoveSpeed) { // 歩き始め
                this.moveSpeed++;
            } else {
                this.moveSpeed = this.maxMoveSpeed;
            }
        } else {
            // ストップ
            this.moveSpeed = this.minMoveSpeed;
            this.updateAnimation(bq.entity.EntityState.Mode.stop, this.currentDirection);
        }

        // ビーム
        var mouseDown = this.inputHandler.shiftMouseDownEvent();
        if (mouseDown) {
            this.shoot(mouseDown.getLocation());
        }
    },

    /**
     * 自分の現在座標をサーバに送信する
     */
    sendPosition: function() {
        var absolPos = this.getPosition();
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
     * destination までビームを出す
     *
     * @param {cc.p} destination
     */
    shoot: function(destination) {
        // BPが残ってるかチェック

        //撃てるならBPを減らす

        this.shootInternal_(destination);
    },

    /**
     * サーバに伝えてからビーム発射
     * @param {cc.p} destination
     * @private
     */
    shootInternal_: function(destination) {
        var src = this.getPosition();
        var dest = bq.camera.convertWindowPositionToWorldPosition(destination);

        var json = { // TODO モデル化したい気持ち
            shooterId: this.name,
            mapId: 1, // TODO mapId
            src: {x: src.x, y: src.y},
            dest: {x: dest.x, y: dest.y},
            beamId: this.beamId[0],
            tag: parseInt(new Date().getTime()) + this.name
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

    getKeyFrameMap_: function () {
        return  {
            idle_bottom:      ["b0_0.png", "b0_1.png", "b0_2.png", "b0_3.png"],
            idle_bottomright: ["b1_0.png", "b1_1.png", "b1_2.png", "b1_3.png"],
            idle_right:       ["b2_0.png", "b2_1.png", "b2_2.png", "b2_3.png"],
            idle_topright:    ["b3_0.png", "b3_1.png", "b3_2.png", "b3_3.png"],
            idle_top:         ["b4_0.png", "b4_1.png", "b4_2.png", "b4_3.png"],
            idle_topleft:     ["b5_0.png", "b5_1.png", "b5_2.png", "b5_3.png"],
            idle_left:        ["b6_0.png", "b6_1.png", "b6_2.png", "b6_3.png"],
            idle_bottomleft:  ["b7_0.png", "b7_1.png", "b7_2.png", "b7_3.png"],
            step_bottom:      ["b0_4.png", "b0_5.png", "b0_6.png", "b0_7.png"],
            step_bottomright: ["b1_4.png", "b1_5.png", "b1_6.png", "b1_7.png"],
            step_right:       ["b2_4.png", "b2_5.png", "b2_6.png", "b2_7.png"],
            step_topright:    ["b3_4.png", "b3_5.png", "b3_6.png", "b3_7.png"],
            step_top:         ["b4_4.png", "b4_5.png", "b4_6.png", "b4_7.png"],
            step_topleft:     ["b5_4.png", "b5_5.png", "b5_6.png", "b5_7.png"],
            step_left:        ["b6_4.png", "b6_5.png", "b6_6.png", "b6_7.png"],
            step_bottomleft:  ["b7_4.png", "b7_5.png", "b7_6.png", "b7_7.png"]
        };
    },

    /**
     * 方向をベクトルに変換する
     * TODO 他のクラスに移す
     * @param {cc.p} direction
     */
    getNormalizedDirectionVector: _.memoize(function(direction) {
        var d = bq.entity.EntityState.Direction;
        var directionVectors = {};
        directionVectors[d.bottom]      = cc.p( 0, -1);
        directionVectors[d.bottomright] = cc.p( 1, -1);
        directionVectors[d.right]       = cc.p( 1,  0);
        directionVectors[d.topright]    = cc.p( 1,  1);
        directionVectors[d.top]         = cc.p( 0,  1);
        directionVectors[d.topleft]     = cc.p(-1,  1);
        directionVectors[d.left]        = cc.p(-1,  0);
        directionVectors[d.bottomleft]  = cc.p(-1, -1);
        return cc.pNormalize(directionVectors[direction]);
    })
});

bq.entity.Player.InputHandler = cc.Class.extend({
    downKeys_: [],        // 押されているキーのリスト
    mouseDownEvents_: [], // クリックイベント

    /** @override */
    onKeyDown: function(key) {
        this.addDownKey_(key);
    },

    /** @override */
    onKeyUp: function(key) {
        this.removeDownKey_(key);
    },

    /**
     *
     * @param event
     */
    onMouseDown: function(event) {
        this.mouseDownEvents_.push(event);
    },

    /**
     * 同時押し時に滑らかに移動させたいので現在押されているキーをリストに登録して管理する
     * @param {Event} key
     * @private
     */
    addDownKey_: function(key) {
        if (!_.contains(this.downKeys_, key)) {
            this.downKeys_.push(key);
        }
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
    getDirection: function() {
        if(_.isEmpty(this.downKeys_)) {
            return null;
        }
        var downKeys = this.downKeys_.slice(0, 2);
        var direction = this.getDirectionByDownKeys_(downKeys);

        // getDirectionByDownKeysが想定していないキーのペア( macのcmdキーとか )
        // だとずっとnullが返り続けて動けなくなるのでdownKeys_をリセットする
        if (!direction) {
            this.downKeys_ = [];
        }
        return direction;
    },

    getDirectionByDownKeys_: _.memoize(function(downKeys) {
        var pairs = [
            {key: [cc.KEY.s],           val: bq.entity.EntityState.Direction.bottom},
            {key: [cc.KEY.s, cc.KEY.d], val: bq.entity.EntityState.Direction.bottomright},
            {key: [cc.KEY.d],           val: bq.entity.EntityState.Direction.right},
            {key: [cc.KEY.d, cc.KEY.w], val: bq.entity.EntityState.Direction.topright},
            {key: [cc.KEY.w],           val: bq.entity.EntityState.Direction.top},
            {key: [cc.KEY.w, cc.KEY.a], val: bq.entity.EntityState.Direction.topleft},
            {key: [cc.KEY.a],           val: bq.entity.EntityState.Direction.left},
            {key: [cc.KEY.a, cc.KEY.s], val: bq.entity.EntityState.Direction.bottomleft},
            {key: [cc.KEY.a, cc.KEY.d], val: null},
            {key: [cc.KEY.w, cc.KEY.s], val: null}
        ];

        var found = _.find(pairs, function(pair) {
            return ( downKeys.length==1 && _.contains(downKeys, pair.key[0]) )
                || ( downKeys.length==2 && _.contains(downKeys, pair.key[0]) && _.contains(downKeys, pair.key[1]) );
        });

        if (_.isUndefined(found)) {
            return null;
        }

        return found.val;
    }),

    shiftMouseDownEvent: function() {
        return this.mouseDownEvents_.shift();
    }
});

