/**
 * @fileoverview Entity (player, mob, npc) の行動などなどを管理する
 */

bq.EntityManager = cc.Class.extend({
    otherPlayers_: {},
    enemys_: {},
    npcs_: {},
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
            bq.MessageLog.getInstance().addSystemMsg('この辺にはオンラインの他プレイヤーが' + players.length + '人いるようだ。');
        }, this));
    },


    removeOtherPlayer: function(id) {
        if (this.otherPlayers_[id]) {
            delete this.otherPlayers_[id];
        }
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
        if (targetOther) {
            var msgLog = bq.MessageLog.getInstance();
            msgLog.addChatMsg(chatData.userId + ': ' + chatData.message);
            targetOther.showMessage(chatData.message);
        }
    },

    /**
     * 他プレイヤーが動いたという情報がサーバから帰ってきたら呼ばれる
     * @param {bq.model.PlayerMove} moveData
     */
    moveTo: function(moveData) {
        var otherPlayer = this.otherPlayers_[moveData.userId];
        if (!otherPlayer) {
            this.createOtherPlayer(moveData);
        } else {
            otherPlayer.moveTo(cc.p(moveData.x, moveData.y));
        }
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
     * playerが死んだら呼ばれる
     * @param {Object} data
     */
    killPlayer: function(data) {
        var player = this.otherPlayers_[data.entity.name];
        if (player) {
            player.kill(true);
        } else if (bq.player.name === data.entity.name) {
            bq.player.kill();
        }
    },

    /**
     * 他playerが復活したら呼ばれる
     * @param {Object} data
     */
    respawnOtherPlayer: function(data) {
        var player = this.otherPlayers_[data.entity.name];
        if (player) {
            player.respawn();
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
            enemy.updateHp({entity: data.entity, hpAmount: data.hpAmount}, hitRight);
        }

        // ビームを消す
        bq.BeamManager.getInstance().disposeBeam(data);
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
     * @param {Array.<Object>} data
     */
    updateHp: function(data) {
        _.forEach(data.hpDatas, function(hpData) {
            if (hpData.entity.id === bq.player.name) {
                bq.player.updateHp(hpData);
            } else {
                var enemy = this.enemys_[hpData.entity.id];
                var player = this.otherPlayers_[hpData.entity.id];
                if (enemy) {
                    enemy.updateHp(hpData);
                } else if (player) {
                    player.updateHp(hpData);
                }
            }
        }.bind(this));
    },

    /**
     * レベルアップした
     * @param {bq.model.Player} model
     */
    levelUp: function(model) {
        if (model.id === bq.player.name) {
            bq.player.setModel(model);
            bq.player.levelUp();
        }
        var msg = model.id + ' はレベル' + model.lv + 'になった！';
        bq.MessageLog.getInstance().addStatusMsg(msg);
    },

    logout: function(data) {
        var logoutPlayer =  this.otherPlayers_[data.userId];
        if (logoutPlayer) {
            this.announceLogInOutMsg_(data.userId, 'がログアウトした。');
            logoutPlayer.removeFromParent();
            this.removeOtherPlayer(data.userId);
        }
    },

    login: function(data) {
        this.announceLogInOutMsg_(data.userId, 'がログインした。');
    },

    /**
     *
     * @param {string} userId
     * @param {string} suffix 〜がログインした　みたいな
     * @private
     */
    announceLogInOutMsg_: function(userId, suffix) {
        var now = new Date();
        var msg = ('0' + now.getHours()).slice(-2) + ':' +
            ('0' + now.getMinutes()).slice(-2) + ' ' + userId + ' ' + suffix;
        bq.MessageLog.getInstance().addSystemMsg(msg);
    }

});


bq.EntityManager.instance_ = new bq.EntityManager();

bq.EntityManager.getInstance = function() {
    return bq.EntityManager.instance_;
};
