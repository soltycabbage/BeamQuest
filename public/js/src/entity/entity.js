/**
 * @fileoverview プレイヤー、mob、NPC、全てのキャラクターの基底クラス
 */
bq.entity = {};

/**
 * @constructor
 * @extends {cc.Sprite}
 */
bq.entity.Entity = cc.PhysicsSprite.extend({
    DEFAULT_NAME: 'entity',
    name: 'entity', // entityの名前
    chatRect: null, // チャット吹き出しのSprite
    currentState:null,
    currentDirection:null,
    model_: null,
    shape_: null,
    isCasting: false, // スキルキャスト中ならtrue

    /**
     * @param {string} spriteFrameName *.plistの<key>に設定されてるframeName
     */
    ctor: function(spriteFrameName, frameMap) {
        this._super();
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        spriteFrame && this.initWithSpriteFrame(spriteFrame); // TODO initWithSpriteFrameName ? iwg
        if ( frameMap ) {
            this.animations = bq.entity.Animation.createAnimations(frameMap);
        }
        var body = new cp.Body(0.0001, 0.001);
        this.setBody(body);
        if ( bq.space ) {
            this.shape_ = new cp.BoxShape(this.getBody(), 16, 16);
            this.shape_.setCollisionType(2);
            bq.space.addShape(this.shape_);
        }
        this.init_();
    },

    /**
     * @private
     */
    init_: function() {
        if (this.DEFAULT_NAME !== this.name) {
            this.showName(this.name, true);
        }
    },

    /**
     * @param {bq.model.Model} model
     */
    setModel: function(model) {
        this.shape_ && (this.shape_.id = model.id); // TODO よくない
        this.model_ = model;
    },

    /**
     * @return {bq.model.Model}
     */
    getModel: function() {
        return this.model_;
    },

    /**
     * 当たり判定の範囲を矩形で返す
     * @return {cc.rect}
     */
    getCollideRect: function() {
        var a = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
    },

    /**
     * Entityの頭上にキャラ名を表示する
     */
    showName: function() {
        var rect = this.getBoundingBox();
        var label = bq.Label.createWithShadow(this.name);

        label.setPosition(cc.p(rect.width / 2, rect.height + 3));
        this.addChild(label);
    },

    /**
     * 獲得経験値をポーンって出す
     * @param {number} exp
     * @private
     */
    popExpLabel: function(exp) {
        var label = bq.Label.createWithShadow(exp + 'exp', 18);
        var pos = this.getPosition();
        var fadeOut = cc.FadeOut.create(1);
        var moveTo = cc.MoveTo.create(1, cc.p(pos.x, pos.y+40));
        var callFunc = cc.CallFunc.create(label.removeFromParent.bind(label));
        label.runAction(cc.Sequence.create(cc.Spawn.create(fadeOut, moveTo), callFunc));
        label.setPosition(pos.x, pos.y);
        bq.baseLayer.addChild(label, bq.config.zOrder.EXP_LABEL);
    },

    /**
     * 指定位置に移動する
     * @param {cc.p} pos
     */
    moveTo: function(pos) {
        this.setOpacity(255);
        var moveActTag = 'entity_move_' + this.name;
        var move = cc.MoveTo.create(0.2, pos);
        if (this.currentState == bq.entity.EntityState.Mode.walking) {
            var runningMoveAct = this.getActionByTag(moveActTag);
            if (runningMoveAct) {
                this.stopAction(runningMoveAct);
                runningMoveAct = null;
            }

            // 走ってる状態だったら移動だけ（アニメーションは更新しない）
            move.setTag(moveActTag);
            this.runAction(move);
        } else {
            this.updateAnimation(bq.entity.EntityState.Mode.walking, null);
            // 移動したあと急に止めるとアニメーションが不自然になるので少し遅延を入れる
            var delay = cc.DelayTime.create(0.2);
            var changeAnime = cc.CallFunc.create(function () {
                this.updateAnimation(bq.entity.EntityState.Mode.stop, null);
            }.bind(this));

            var act = cc.Sequence.create([move, delay, changeAnime]);
            this.runAction(act);
        }
    },

    /**
     * 死にモーション
     * @param {boolean=} opt_skipRemove 見かけ上非表示にするだけでレイヤーから消したくない時はtrue
     * @param {Function=} opt_callback 死にモーションが終わった時に呼びたい関数
     */
    kill: function(opt_skipRemove, opt_callback) {
        var fadeOut = cc.FadeOut.create(0.8);
        var blink = cc.Blink.create(1, 50);
        var callFunc = cc.CallFunc.create(function() {
            opt_callback && opt_callback.apply(this);
            if(!opt_skipRemove) {
                this.removeFromParent();
            }
        }.bind(this));

        this.runAction(cc.Sequence.create(cc.Spawn.create(fadeOut, blink), callFunc));
    },

    /** 復活処理 */
    respawn: function() {
        this.isCasting = false;
        var fadeIn = cc.FadeIn.create(0.8);
        this.runAction(fadeIn);
    },

    /**
     * entityの頭らへんに吹き出しを出す
     * @param {string} msg
     */
    showMessage: function(msg) {
        this.removeChatRect_(this.chatRect);
        var rect = this.getBoundingBox();

        // 吹き出し
        var msgRect = cc.Sprite.create();
        msgRect.setTextureRect(cc.rect(0, 0, msg.length * 12 + 20, 20));
        msgRect.setColor(cc.color(0, 0, 0));
        msgRect.setOpacity(200);
        msgRect.setPosition(cc.p(rect.width / 2, rect.height + 30));

        // label
        var tt = bq.Label.create(msg);
        tt.setPosition(cc.p(msgRect.getBoundingBox().width / 2, 10));

        // 吹き出しのしっぽみたいなやつ
        var tail = cc.Sprite.create(s_ImgChatTail);
        tail.setColor(cc.color(0, 0, 0));
        tail.setOpacity(200);
        tail.setPosition(cc.p(msgRect.getBoundingBox().width / 2, -3));

        msgRect.addChild(tt);
        msgRect.addChild(tail, -100);
        this.addChild(msgRect, bq.config.zOrder.CHAT);
        this.chatRect = msgRect;
        setTimeout($.proxy(this.removeChatRect_, this, msgRect), 5000);
    },

    /**
     * チャットの吹き出しを消す
     * @param {cc.Sprite} msgRect
     * @private
     */
    removeChatRect_: function(msgRect) {
        if (this.chatRect === msgRect) {
            this.removeChild(this.chatRect);
            this.chatRect = null;
        }
    },

    /**
     * @param {string} key
     * @returns {bq.Animate}
     */
    getAnimationByKey: function(key) {
        if (this.animations[key] ) {
            return this.animations[key];
        } else {
            cc.log(key + " is not found");
            return null;
        }
    },

    /**
     *
     * @param {string} name
     * @param {string} direction
     * @returns {bq.Animate}
     */
    getAnimationByNameDirection: function(name, direction) {
        var key = name + "_" + direction;
        return this.getAnimationByKey(key);
    },

    /**
     * 向きと状態を更新してそれにもとづいてアニメーションを更新する
     * @param {bq.entity.EntityState.Direction} dir 向き
     * @param {bq.entity.EntityState.Mode} sts 状態
     */
    updateAnimation: function(state, direction){

        if ( state === null && direction === null ) {
            return;
        }
        if ( state === this.currentState && direction === this.currentDirection ) {
            return ;
        }
        state = state ? state : this.currentState;
        direction = direction ? direction : this.currentDirection;

        this.currentState = state;
        this.currentDirection = direction;

        var animation = this.getAnimationByNameDirection(state,direction);
        animation.setTag('walk');

        this.stopForeverAnimation();
        this.runAction(animation);
    },

    /**
     * @param {Object} hpData HP変動データ
     * @param {number} opt_popLeft trueならダメージラベルが左に飛ぶよ
     * @param {cc.color=} opt_color ダメージラベルの色
     */
    updateHp: function(hpData, opt_popLeft, opt_color) {
        var amount = hpData.hpAmount;
        if (amount < 0) { // ダメージ
            bq.soundManager.playEffect(s_SeDamage);
            this.popDamageLabel_(hpData, !!opt_popLeft, opt_color);
        } else if (amount > 0) { // 回復
            // TODO
        } else { // ノーダメやで
            bq.soundManager.playEffect(s_SeNoDamage);
            this.popNoDamageLabel_(!!opt_popLeft);
        }

        // HPバーを頭上に表示
        var maxHp = hpData.entity.maxHp;
        var currentHp = hpData.entity.hp;
        if (maxHp !== currentHp) {
            this.showHpGauge(hpData.entity.maxHp, hpData.entity.hp);
        } else {
            this.hideHpGauge_();
        }
    },

    /**
     * 頭上にHPバーを表示する
     * @param {number} maxHp 最大HP
     * @param {number} hp 現在HP
     */
    showHpGauge: function(maxHp, hp) {
        if (this.hpGauge_) {
            this.hpGauge_.removeFromParent();
        }

        var prevHp = this.prevHp_? this.prevHp_ : hp;
        var ratio = hp / maxHp;
        var prevHpRatio = prevHp / maxHp;
        var gaugeWidth = 70;
        var gaugeHeight = 4;
        var entityRect = this.getBoundingBox();
        var currentHpWidth = gaugeWidth * ratio;
        var prevHpWidth = gaugeWidth * prevHpRatio;

        // HP部分
        var rect = cc.Sprite.create();
        rect.setTextureRect(cc.rect(0, 0, currentHpWidth, gaugeHeight));
        rect.setColor(cc.color(255, 20, 5));
        rect.setPosition(cc.p(entityRect.width / 2 - gaugeWidth / 2,
            entityRect.height + 15));
        rect.setAnchorPoint(0, 0.5);

        // HP減少したときの差分のとこ
        var rectInner = cc.Sprite.create();
        rectInner.setTextureRect(cc.rect(0, 0, prevHpWidth, gaugeHeight));
        rectInner.setColor(cc.color(255, 170, 170));
        rectInner.setPosition(cc.p(0, 2));
        rectInner.setAnchorPoint(0, 0.5);
        rectInner.runAction(cc.ScaleTo.create(0.5, currentHpWidth / prevHpWidth, 1));

        // 黒背景
        var rectOuter = cc.Sprite.create();
        rectOuter.setTextureRect(cc.rect(0, 0, gaugeWidth + 2, gaugeHeight + 2));
        rectOuter.setColor(cc.color(0, 0, 0));
        rectOuter.setAnchorPoint(0, 0.5);
        rectOuter.setPosition(cc.p(-1, 2));

        rect.addChild(rectInner, -1);
        rect.addChild(rectOuter, -2);

        this.hpGauge_ = rect;
        this.addChild(rect, bq.config.zOrder.CHAT + 1);

        // 次に表示した時にどのくらいHPが増減したかを知りたいので記録しておく
        this.prevHp_ = hp;
    },

    /**
     * HPバーを隠す
     * @private
     */
    hideHpGauge_: function() {
        if (!this.hpGauge_) {
            return;
        }

        var fadeOut = cc.FadeOut.create(0.5);
        var callFunc = cc.CallFunc.create(_.bind(function() {
            this.hpGauge_ && this.hpGauge_.removeFromParent();
        }, this));
        this.hpGauge_.runAction(cc.Sequence.create(fadeOut, callFunc));
    },


    /**
     * キャストを開始する
     * @param {Object.<mapId: string, userId: string, skill: bq.model.Skill>} data
     */
    cast: function(data) {
        // すでにキャスト中ならキャストできない
        if (this.isCasting) {
            // TODO: メッセージを出す
            return;
        }
        this.isCasting = true;
        var castTime = data.skill.castTime;
        var entityRect = this.getBoundingBox();
        var castBarWidth = 100;
        var castBarHeight = 10;
        var barTop = 25;

        var rect = cc.Sprite.create();
        rect.setTextureRect(cc.rect(0, 0, castBarWidth, castBarHeight));
        rect.setColor(cc.color(77, 50, 255));
        rect.setOpacity(200);
        rect.setPosition(cc.p(entityRect.width / 2 - castBarWidth / 2,
            entityRect.height + barTop));
        rect.setAnchorPoint(0, 0.5);

        var rectOuter = cc.Sprite.create();
        rectOuter.setTextureRect(cc.rect(0, 0, castBarWidth + 2, castBarHeight + 2));
        rectOuter.setColor(cc.color(0, 0, 0));
        rectOuter.setOpacity(100);
        rectOuter.setAnchorPoint(0, 0.5);
        rectOuter.setPosition(cc.p(-1, 5));
        rect.addChild(rectOuter, -1);

        var skillName = bq.Label.createWithShadow(data.skill.name, 10, cc.color(200, 255, 30));
        skillName.setPosition(cc.p(entityRect.width / 2, entityRect.height + barTop + castBarHeight + 5));

        var scaleAnim = cc.ScaleTo.create(castTime / 1000, 0, 1);
        rect.runAction(cc.Sequence.create(scaleAnim,
            cc.CallFunc.create(_.bind(function() {
                rect.removeFromParent();
                skillName.removeFromParent();
                this.isCasting = false;
            }, this)))
        );
        this.addChild(skillName, bq.config.zOrder.CHAT + 1);
        this.addChild(rect, bq.config.zOrder.CHAT + 1);
    },

    /**
     * @param {bq.model.Skill} skill
     * @param {bq.model.Position} targetPos
     */
    fireSkill: function(skillModel, targetPos) {
        var skillFactory = bq.skill.SkillFactory.getInstance();
        var skill = skillFactory.create(skillModel, this, targetPos);
        skill.fire();
    },

    /**
     * 常に動いているアニメーション(歩行アニメーションとか)を止める
     */
    stopForeverAnimation: function() {
        var walkAnimation = this.getActionByTag('walk');
        if (walkAnimation) {
            this.stopAction(walkAnimation);
        }
    },

    /**
     * @param {Object} hpData
     * @param {boolean=} opt_popLeft
     * @param {cc.color=} opt_color
     * @private
     */
    popDamageLabel_: function(hpData, opt_popLeft, opt_color) {
        var amount = hpData.hpAmount;
        var damage = Math.abs(amount);
        var size = hpData.isCritical ? 32 : 16;
        if (hpData.isCritical) {
            damage += '!!';
        }
        var label = bq.Label.createWithShadow(damage, size, opt_color);
        var rect = this.getBoundingBox();
        label.setPosition(cc.p(rect.width / 2, rect.height));
        var d = opt_popLeft ? -1 : 1;
        var action = cc.JumpTo.create(1.5, cc.p(d * 200, -100), 100, 1);
        var fadeOut = cc.FadeOut.create(1.5);
        this.addChild(label);
        label.runAction(cc.Sequence.create(cc.Spawn.create(action, fadeOut),
            cc.CallFunc.create(function() {
                label.removeFromParent();
            })));
    },

    /**
     * ノーダメの時のラベルを出す
     * @private
     */
    popNoDamageLabel_: function(popLeft) {
        var label = bq.Label.createWithShadow('Ineffective!', 20);
        var rect = this.getBoundingBox();
        label.setPosition(cc.p(rect.width / 2, rect.height));
        var d = popLeft ? -1 : 1;
        var action = cc.JumpTo.create(1.5, cc.p(d * 200, -100), 100, 1);
        var fadeOut = cc.FadeOut.create(1.5);
        this.addChild(label);
        label.runAction(cc.Sequence.create(cc.Spawn.create(action, fadeOut),
            cc.CallFunc.create(function() {
                label.removeFromParent();
            })));
    }
});
