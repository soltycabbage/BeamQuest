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
    selectedHotbarNumber_: null,             // 選択中のホットバーitem

    mapId: 0,                                // 現在いる mapId

    ctor:function () {
        this._super('b0_0.png', this.getKeyFrameMap_());
        this.currentDirection = bq.entity.EntityState.Direction.bottom;

        this.socket = bq.Socket.getInstance();
        this.inputHandler = new bq.entity.Player.InputHandler();
        this.scheduleUpdate();
        this.schedule(this.sendPosition, this.POSITION_SEND_INTERVAL);
        $(this.inputHandler).on(bq.entity.Player.InputHandler.EventType.TOUCH_END, this.handleTouchEnd_.bind(this));
        $(this.inputHandler).on(bq.entity.Player.InputHandler.EventType.STREAK_KEY, this.handleStreakKey_.bind(this));
    },

    /** @override */
    setModel: function(model) {
        this._super(model);
        this.initHp();
        this.initBp();
        this.initExp();
        this.initLevel();
        this.initHotbar();
    },

    /** @override */
    update: function () {
        this._super();
        if (this.currentState === bq.entity.EntityState.Mode.death) {
            // 死んでいたらなにもできない。人生と同じ。
            return;
        }

        var direction = this.inputHandler.getDirection();
        if (direction && this.currentState !== bq.entity.EntityState.Mode.dodge) {
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
     * 回避行動
     * @param {bq.entity.EntityState.Direction} direction
     * @private
     */
    dodgeInternal_: function(direction) {
        var currentPosition = this.getPosition();
        var directionVector = this.getNormalizedDirectionVector(direction);
        var moveDistance = cc.pMult(directionVector, 100);
        var nextPos = cc.pAdd(currentPosition, moveDistance);

        // サーバに回避行動を開始したことを伝える
        var posData = {
            userId: this.name,
            x: nextPos.x,
            y: nextPos.y,
            direction: direction
        }
        this.socket.sendDodge(posData);
        this.dodgeTo(nextPos);
        bq.camera.forceLook();
    },

    /**
     * 自分の現在座標をサーバに送信する
     */
    sendPosition: function() {
        var absolPos = this.getPosition();
        var posData = {
            userId: this.name,
            x: absolPos.x,
            y: absolPos.y,
            direction: this.currentDirection
        };

        // 前回送信時と位置が変わってなかったら送信しない
        if (this.prevPos_.x === posData.x && this.prevPos_.y === posData.y) {
            return;
        }
        this.prevPos_.x = posData.x;
        this.prevPos_.y = posData.y;
        this.socket.sendPlayerPosition(posData);
    },

    /**
     * destination までビームorスキルを発動する
     *
     * @param {cc.p} destination
     */
    shoot: function(destination) {
        // スキル選択中ならスキル発動
        if (this.selectedHotbarNumber_ !== null && !this.isCasting) {
            var hotNum = this.selectedHotbarNumber_ === 0 ? 8 : this.selectedHotbarNumber_ - 1;
            var item = this.model_.hotbarItems[hotNum];
            if (!item) { // ホットバーが空
                this.shootInternal_(destination);
            }
            var dest = bq.camera.convertWindowPositionToWorldPosition(destination);
            this.socket.castSkill(item.id, this.model_.id, dest);
        } else {
            this.shootInternal_(destination);
        }
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
            src: {x: src.x, y: src.y},
            dest: {x: dest.x, y: dest.y},
            tag: parseInt(new Date().getTime()) + this.name
        };

        this.socket.shootBeam(json);
    },

    /** @override */
    updateHp: function(hpData) {
        this._super(hpData, null, cc.color(255, 80, 80));
        $(this).triggerHandler(bq.entity.Player.EventType.UPDATE_HP, [hpData.entity.hp, this.model_]);
    },

    initHp: function() {
        $(this).triggerHandler(bq.entity.Player.EventType.INIT_HP, [this.model_.hp, this.model_.maxHp]);
    },

    updateBp: function(bpData) {
        $(this).triggerHandler(bq.entity.Player.EventType.UPDATE_BP, [bpData.entity.bp, this.model_]);
    },

    initBp: function() {
        $(this).triggerHandler(bq.entity.Player.EventType.INIT_BP, [this.model_.bp, this.model_.maxBp]);
    },

    initExp: function() {
        $(this).triggerHandler(bq.entity.Player.EventType.UPDATE_EXP, [this.model_.prevLvExp, this.model_.exp, this.model_.nextLvExp]);
    },

    /**
     * 習得スキル一覧からホットバーに配置する
     */
    initHotbar: function() {
        var items = this.model_.hotbarItems;
        _.forEach(items, function(item, index) {
            var hotNum = (index + 1) % 10;
            var hotbarItem = $('#bq-hot-bar-item-' + hotNum);
            var img = $('<img/>').attr('src', 'res/img/icon/'+ item.id + '.png');
            hotbarItem.append(img);
        });
    },

    /**
     * @param {Object.<exp: number, prevLvExp: number, currentExp: number, nextLvExp: number> data
     */
    updateExp: function(data) {
        this.popExpLabel(data.exp);
        this.model_.addExp(data.exp);
        bq.Hud.getInstance().addInstantMsg(
            data.mobName + 'を倒した！ <span style="color: cyan;">' + data.exp + '</span>の経験値を獲得！');
        $(this).triggerHandler(bq.entity.Player.EventType.UPDATE_EXP, [data.prevLvExp, data.currentExp, data.nextLvExp]);
    },

    /**
     * @param {number=} opt_level
     */
    initLevel: function(opt_level) {
        var level = opt_level || this.model_.lv;
        $(this).triggerHandler(bq.entity.Player.EventType.INIT_LEVEL, [level]);
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
        this.name = data.name;
    },

    /**
     * 押された数字キーに対応するitemを選択した状態にする
     * @param {number} num
     */
    setSelectedHotbarNumber: function(num) {
        if (this.selectedHotbarNumber_ !== num) {
            this.selectedHotbarNumber_ = num;
        } else {
            this.selectedHotbarNumber_ = null;
        }
    },

    /** @override */
    kill: function(){
        this.currentState = bq.entity.EntityState.Mode.death;
        bq.MessageLog.getInstance().addSystemMsg('あなたは死にました。復活地点に戻ります。');
        this.stopForeverAnimation();

        // 死亡モーション＊くるくるまわってぱたっと倒れる
        bq.soundManager.playEffect(s_SeDeath1);
        var rotateFrames = this.getKeyFrameMap_()['rotate'];
        var rotateAnimation = new cc.Animation();
        rotateAnimation.setDelayPerUnit(0.03);
        rotateAnimation.setLoops(5);
        _.forEach(rotateFrames, function(rotateFrame) {
            rotateAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(rotateFrame));
        });
        var deathFrames = this.getKeyFrameMap_()['death'];
        var deathAnimation = new cc.Animation();
        deathAnimation.setDelayPerUnit(0.1);
        _.forEach(deathFrames, function(deathFrame) {
            deathAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(deathFrame));
        });

        var fadeOut = new cc.FadeOut(0.8);
        var blink = new cc.Blink(1, 50);
        var delay = new cc.DelayTime(1);
        var callFunc = new cc.CallFunc(this.respawn.bind(this));
        this.runAction(new cc.Sequence(
            new cc.Animate(rotateAnimation),  // くるくるまわって
            new cc.CallFunc(function() {bq.soundManager.playEffect(s_SeDeath2);}),
            new cc.Animate(deathAnimation),   // ぱたっと倒れて
            delay, // 1秒待って
            new cc.Spawn(fadeOut, blink),     // 点滅しながら消えていく
            delay,
            callFunc
        ));
    },

    /** @override */
    respawn: function() {
        this.currentState = bq.entity.EntityState.Mode.stop;
        this.socket.sendRespawn(this.getModel());
        this.setPosition(bq.mapManager.getRespawnPoint());
        this.sendPosition();
        var fadeIn = new cc.FadeIn(0.8);
        this.runAction(fadeIn);
    },

    /**
     * レベルアップのエフェクト
     */
    levelUp: function() {
        // TODO エフェクト処理を書く
        bq.soundManager.playEffect(s_SeLevelUp);
    },

    /** @override */
    getKeyFrameMap_: function () {
        return bq.entity.Player.KEY_FRAME_MAP;
    },

    handleTouchEnd_: function(evt, touchData) {
        this.shoot(touchData.getLocation());
    },

    /**
     * 同じ方向キーを二連打することで回避行動を取る
     * @private
     */
    handleStreakKey_: function(evt, direction) {
        if (direction && this.currentState !== bq.entity.EntityState.Mode.dodge) {
            this.currentState = bq.entity.EntityState.Mode.dodge;
            this.dodgeInternal_(direction);
        }
    }
});

/**
 * Playerが発火するイベント一覧
 * @enum
 */
bq.entity.Player.EventType = {
    INIT_HP: 'inithp',
    INIT_BP: 'initbp',
    INIT_LEVEL: 'updatelevel',
    UPDATE_HP: 'updatehp',
    UPDATE_BP: 'updatebp',
    UPDATE_EXP: 'updateexp',
    SELECT_HOT_BAR: 'selecthotbar'
};

bq.entity.Player.InputHandler = cc.Class.extend({
    downKeys_: [],        // 押されているキーのリスト
    mouseDownEvents_: [], // クリックイベント
    isShiftKeyPressed_: false, // SHIFTキーが押されている間はTRUE
    streakDownKeys_: [],  // 連打判定用の配列
    streakTimer_: -1,   // 連打判定用のタイマー
    ctor: function() {
        this.init();
    },

    init: function() {
        if (cc.sys.isMobile) {
            this.initVirtualPad_();
        }

        // ゲーム画面からフォーカスが外れたら移動しっぱなしになることがあるので押下キーリストを初期化する
        $(cc.canvas).blur(function() {
            this.downKeys_ = [];
        }.bind(this));
    },

    /**
     * バーチャルパッドの初期化
     * @private
     */
    initVirtualPad_: function() {
        var handler = this;

        var getBtnSetting = function(key) {
            return {
                opacity: '1',
                stroke: 0,
                touchStart: function() {
                    handler.addDownKey_(key);
                },
                touchEnd: function() {
                    handler.removeDownKey_(key);
                }
            };
        };

        var up = getBtnSetting(cc.KEY.w);
        up.height = '15%';
        var down = getBtnSetting(cc.KEY.s);
        down.height = '15%';
        var left = getBtnSetting(cc.KEY.a);
        left.width = '15%';
        var right = getBtnSetting(cc.KEY.d);
        right.width = '15%';
        GameController.init({
            right: {
                type: 'dpad',
                dpad: {
                    up: up,
                    down: down,
                    left: left,
                    right: right
                }
            },
            left: false
        });
    },

    /**
     * 引数countで指定された回数を連打していたらTRUE
     * @param {number} key
     * @param {number} count
     * @return {boolean}
     * @private
     */
    isStreak_: function(key, count) {
        if (this.streakDownKeys_.length !== count) {
            return false;
        }
        for (var i = 0;i < this.streakDownKeys_.length;i++) {
            if (this.streakDownKeys_[i] !== key) {
                return false;
            }
        }
        return true;
    },

    /**
     * 特定のキーに機能を持たせたい場合はここに記述していく
     * @override
     */
    onKeyDown: function(key) {
        this.addDownKey_(key);
        switch(key) {
            case cc.KEY.shift:
                this.isShiftKeyPressed_ = true;
                break;
            case cc.KEY.i: // iキーでステータスウィンドウを開く
                bq.Hud.getInstance().openStatusWindow(bq.player.name);
                break;
            case cc.KEY['1']:
            case cc.KEY['2']:
            case cc.KEY['3']:
            case cc.KEY['4']:
            case cc.KEY['5']:
            case cc.KEY['6']:
            case cc.KEY['7']:
            case cc.KEY['8']:
            case cc.KEY['9']:
            case cc.KEY['0']:
                // 1キーのkeyCodeは49
                this.handleNumKeyDown_(key - 48);
                break;
            default:
                break;
        }
    },

    /** @override */
    onKeyUp: function(key) {
        this.streakDownKeys_.unshift(key);
        // 同じ方向キーを短時間に2回押すと緊急回避を発動
        if (this.isStreak_(key, 2)) {
            $(this).triggerHandler(bq.entity.Player.InputHandler.EventType.STREAK_KEY, this.getDirection());
        }

        this.streakTimer_ && clearTimeout(this.streakTimer_);
        this.streakTimer_ = setTimeout(_.bind(function() {
            if (this.streakDownKeys_.length)
                this.streakDownKeys_ = [];
        }, this), 300);

        this.removeDownKey_(key);
        if (key === cc.KEY.shift) {
            this.isShiftKeyPressed_ = false;
        }
    },

    /**
     *
     * @param event
     */
    onMouseDown: function(event) {
        this.mouseDownEvents_.push(event);
    },

    /** @override */
    onTouchesEnded: function(event) {
        if (!_.isEmpty(event)) {
            var touchEvt = event[0];
            $(this).triggerHandler(bq.entity.Player.InputHandler.EventType.TOUCH_END, touchEvt);
        }
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
            return ( downKeys.length==1 && _.contains(downKeys, pair.key[0]) ) ||
                ( downKeys.length==2 && _.contains(downKeys, pair.key[0]) && _.contains(downKeys, pair.key[1]) );
        });

        if (_.isUndefined(found)) {
            return null;
        }

        return found.val;
    }),

    shiftMouseDownEvent: function() {
        return this.mouseDownEvents_.shift();
    },

    /**
     * 数字キーが押された時の動作
     * @param {number} num
     * @private
     */
    handleNumKeyDown_: function(num) {
        $(bq.player).triggerHandler(bq.entity.Player.EventType.SELECT_HOT_BAR, [num]);
        bq.player.setSelectedHotbarNumber(num);
    },

    /**
     * マウス入力応急処置 for cocos2d-js v3.0beta
     * @return {cc.EventListener}
     */
    getMouseListener: function() {
        return cc.EventListener.create({
            event: cc.EventListener.MOUSE,

            onMouseDown: _.bind(this.onMouseDown, this)
        });
    },

    /**
     * キー入力応急処置 for cocos2d-js v3.0beta
     * @return {cc.EventListener}
     */
    getKeyboardListener: function() {
        return cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: _.bind(this.onKeyDown, this),
            onKeyReleased: _.bind(this.onKeyUp, this)
        });
    },

    /**
     * SHIFTキーが押されていたらTRUE
     * @returns {boolean}
     */
    isShiftKeyPressed: function() {
        return this.isShiftKeyPressed_;
    }

});

/**
 * InputHandlerが発火するイベント一覧
 * TODO: mousedownもここに入れた方がよさげ
 * @const
 */
bq.entity.Player.InputHandler.EventType = {
    TOUCH_END: 'touchend',
    STREAK_KEY: 'streakkey'
};


/**
 * プレイヤーの状態や向きに応じてどういうアニメーションをさせたいかを定義する。
 * @const {Object}
 */
bq.entity.Player.KEY_FRAME_MAP = {
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
    step_bottomleft:  ["b7_4.png", "b7_5.png", "b7_6.png", "b7_7.png"],
    rotate:           ["b0_0.png", "b1_0.png","b2_0.png", "b3_0.png","b4_0.png", "b5_0.png","b6_0.png", "b7_0.png"],
    death:            ["playerMisc0_0.png","playerMisc0_1.png","playerMisc0_2.png","playerMisc0_3.png"]
};
