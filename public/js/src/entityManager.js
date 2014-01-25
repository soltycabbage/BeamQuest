/**
 * @fileoverview Entity (player, mob, npc) の行動などなどを管理する
 */

bq.EntityManager = cc.Class.extend({
    otherPlayers_: {},
    enemys_: {},
    npcs_: {},
    beams_: {},
    ctor: function() {
    },

    /**
     * サーバからmapIdに指定したマップ上に存在するEntity一覧を取得してきて更新する
     * @param {number} mapId
     */
    updateEntitiesByMapId: function(mapId) {
        var soc = bq.Socket.getInstance();
        soc.requestEntitiesByMapId(mapId, $.proxy(function(data) {
            var players = _.reject(data.players, function(player) {
                return bq.player.name === player.id;
            });
            this.createOtherPlayers(players);
            this.createMobs(data.mobs);
        }, this));
    },

    /**
     * @return {Object}
     */
    getOtherPlayers: function() {
        return this.otherPlayers_;
    },

    /**
     * @return {Object}
     */
    getEnemys: function() {
        return this.enemys_;
    },

    /**
     * 他プレイヤーのチャットを受信したら吹き出しを表示する
     * @param {bq.model.Chat} chatData
     */
    chat: function(chatData) {
        var targetOther = this.otherPlayers_[chatData.userId];
        targetOther &&targetOther.showMessage(chatData.message);
    },

    /**
     * 他プレイヤーが動いたという情報がサーバから帰ってきたら呼ばれる
     * @param {bq.model.PlayerMove} moveData
     */
    moveTo: function(moveData) {
        if (!this.otherPlayers_[moveData.userId]) {
            this.createOtherPlayer(moveData);
        } else {
            var otherPlayer = this.otherPlayers_[moveData.userId];
            var move = cc.MoveTo.create(0.2, cc.p(moveData.x, moveData.y));

            if (otherPlayer.currentState == bq.entity.EntityState.Mode.walking) {
                // 走ってる状態だったら移動だけ（アニメーションは更新しない）
                otherPlayer.runAction(move);
            } else {
                otherPlayer.updateAnimation(bq.entity.EntityState.Mode.walking, null);
                // 移動したあと急に止めるとアニメーションが不自然になるので少し遅延を入れる
                var delay = cc.DelayTime.create(0.2);
                var changeAnime = cc.CallFunc.create(function () {
                    otherPlayer.updateAnimation(bq.entity.EntityState.Mode.stop, null)
                });

                var act = cc.Sequence.create([move, delay, changeAnime]);
                otherPlayer.runAction(act);
            }
        }
    },

    /**
     * ビーム発射
     * @param {bq.model.BeamPos} beamPos
     */
    beamShoot: function(beamPos) {
        // TODO: ほんとはここじゃなくてentityに定義されたshoot()関数的なやつを呼ぶのがいい。
        var beam = bq.beam.Beam.create(beamPos.beamId, beamPos.shooterId, beamPos.tag);
        bq.baseLayer.addChild(beam, 10);
        cc.AudioEngine.getInstance().playEffect(s_SeBeamA);
        beam.initDestination(beamPos.src, beamPos.dest);
        $(beam).on(bq.beam.Beam.EventType.REMOVE, $.proxy(this.handleBeamRemove_, this));
        this.beams_[beamPos.tag] = beam;
    },

    /**
     * @private
     */
    handleBeamRemove_: function(evt) {
        delete this.beams_[evt.currentTarget.tag];
    },

    /**
     * MobがPOPする時に呼ばれる
     * @param {Object} data
     */
    popMob: function(data) {
        this.createMob(data.mob);
    },

    /**
     * mobが死んだら呼ばれる
     * @param {Object} data
     */
    killMob: function(data) {
        var enemy = this.enemys_[data.entity.id];
        if (enemy) {
            enemy.kill();
            delete this.enemys_[data.entity.id];
        }
    },

    /**
     * Entityにビームが当たったら呼ばれる
     * TODO: いまんとこenemyだけ
     * @param {Object} data
     */
    hitEntity: function(data) {
        var enemy = this.enemys_[data.entity.id];

        // 右から当たったら左にダメージラベルがぴょーんて飛ぶ
        if (enemy) {
            var hitRight = (enemy.getPosition().x - data.beamPos.x) < 0;
            enemy.updateHp(data.hpAmount, hitRight);
        }

        var beam = this.beams_[data.beamTag];
        beam && beam.dispose();
    },

    /**
     * @param {Object}
     */
    createOtherPlayers: function(players) {
        _.each(players, $.proxy(function(player) {
            var playerMove = new bq.model.PlayerMove({
                userId: player.id,
                mapId: player.position.mapId,
                x: player.position.x,
                y: player.position.y
            });
            this.createOtherPlayer(playerMove);
        }, this));
    },

    /**
     * @param {bq.model.PlayerMove} moveData
     */
    createOtherPlayer: function(moveData) {
        var data = {
            idle_bottom:      ["b0_0.png", "b0_1.png", "b0_2.png", "b0_3.png"],
            step_bottom:      ["b0_4.png", "b0_5.png", "b0_6.png", "b0_7.png"]
        }; // TODO 関数にする
        var other = new bq.entity.Entity('b0_0.png', data);
        other.updateAnimation(bq.entity.EntityState.Mode.stop, bq.entity.EntityState.Direction.bottom);
        other.name = moveData.userId;
        other.showName(moveData.userId, true);
        other.setPosition(cc.p(moveData.x, moveData.y));
        bq.baseLayer.addChild(other, bq.config.tags.PLAYER);
        this.otherPlayers_[moveData.userId] = other;
    },

    /**
     * @param {Object} mobs
     */
    createMobs: function(mobs) {
        _.each(mobs, $.proxy(function(mob) {
            this.createMob(mob);
        }), this);
    },

    /**
     * @param {Object} mob
     */
    createMob: function(mob) {
        var mobModel = new bq.model.Mob(mob);
        var x = mobModel.position.x;
        var y = mobModel.position.y;
        var enemy_id = 1;
        var enemy = new bq.entity.Enemy(enemy_id);
        enemy.setModel(mobModel);
        enemy.setPosition(cc.p(x, y));
        bq.baseLayer.addChild(enemy, 50);
        this.enemys_[mobModel.id] = enemy;
    },

    /**
     * mobの移動
     * @param {Object}
     */
    mobMoveTo: function(data) {
        var enemy =  this.enemys_[data.mob.id];
        if (enemy) {
            enemy.setPosition(cc.p(data.mob.position.x, data.mob.position.y));
            // var act = cc.MoveTo.create(0.1, cc.p(data.mob.position.x, data.mob.position.y));
            // enemy.runAction(act);
        }
    },

    /**
     * mobが近接攻撃の構えを取った
     * @param {Object.<mob: Object, range: number, castTime: number>} data
     */
    startAttackShortRange: function(data) {
        var enemy =  this.enemys_[data.mobId];
        if (enemy) {
            enemy.showMessage('ころちゅ')
        }
    },

    /**
     * hpに増減があった
     * @param {Array.<Object}data
     */
    updateHp: function(data) {
        _.forEach(data.hpAmounts, function(hpAmount) {
            if (hpAmount.entity.id === bq.player.name) {
                bq.player.updateHp(hpAmount.hpAmount);
            } else {
                var enemy = this.enemys_[hpAmount.entity.id];
                var player = this.otherPlayers_[hpAmount.entity.id];
                if (enemy) {
                    enemy.updateHp(hpAmount.hpAmount);
                } else if (player) {
                    player.updateHp(hpAmount.hpAmount);
                }
            }
        }.bind(this));
    }
});


bq.EntityManager.instance_ = new bq.EntityManager();

bq.EntityManager.getInstance = function() {
    return bq.EntityManager.instance_;
};
