/**
 * @fileoverview socket.ioの初期設定をする
 */

bq.Socket = cc.Class.extend({
    ctor: function() {
        this.socket = io.connect();
    },

    /**
     * ログイン後にsocketで受け取る処理を書く
     */
    initAfterLogin: function() {
        var entityManager = bq.EntityManager.getInstance();
        var beamManager = bq.BeamManager.getInstance();
        /**
         *  ブロードキャストされてきたやつ
         */
        // チャット受信
        this.socket.on('notify:message', function (data) {
            var chatData = new bq.model.Chat(data);
            entityManager.chat(chatData);
        });

        // 他プレイヤーの移動
        this.socket.on('notify:user:move', function(data) {
            var moveData = new bq.model.PlayerMove(data);
            entityManager.moveTo(moveData);
        });

        // ビーム発射
        this.socket.on('notify:beam:shoot', function(data) {
            var beamPos = new bq.model.BeamPos(data);
            beamManager.beamShoot(beamPos);
        });

        // エンティティにビームヒット
        this.socket.on('notify:beam:hit:entity', function(data) {
            entityManager.hitEntity(data);
        });

        // 他プレイヤーがログインしたよって
        this.socket.on('notify:user:login', function(data) {
            entityManager.login(data);
        });

        // マップ上のものにビームヒット
        this.socket.on('notify:beam:hit:object', function(data) {
            beamManager.disposeBeam(data);
        });

        // 他プレイヤーがログアウトしたよって
        this.socket.on('notify:user:logout', function(data) {
            entityManager.logout(data);
        });

        // そのplayer死んだよって
        this.socket.on('notify:entity:player:kill', function(data) {
            entityManager.killPlayer(data);
        });

        // そのplayer生き返ったよって
        this.socket.on('notify:entity:player:respawn', function(data) {
            entityManager.respawnOtherPlayer(data);
        });

        // そのmob死んだよって
        this.socket.on('notify:entity:mob:kill', function(data) {
            entityManager.killMob(data);
        });

        // mobがPOPしたよって
        this.socket.on('notify:entity:mob:pop', function(data) {
            entityManager.popMob(data);
        });

        // mobの移動
        this.socket.on('notify:entity:mob:move', function(data) {
            entityManager.mobMoveTo(data);
        });

        // mobがタゲった
        this.socket.on('notify:entity:mob:targetTo', function(data) {
            entityManager.mobTargetTo(data);
        });

        // mobが近接攻撃の構えを取った
        this.socket.on('notify:entity:mob:startAttackShortRange', function(data) {
            entityManager.startAttackShortRange(data);
        });

        // アイテムがドロップした
        this.socket.on('notify:item:drop', function(data) {
            bq.mapManager.addDropItems(data);
        });

        // 誰かが（自分含む）ドロップアイテム拾ったよって
        this.socket.on('notify:item:pick', function(data) {
            bq.mapManager.removeDropItem(data);
        });

        // hpに変動があった
        this.socket.on('notify:entity:hp:update', function(data) {
            entityManager.updateHp(data);
        });

        // レベルアップしたよって
        this.socket.on('notify:entity:player:levelup', function(data) {
            var model = new bq.model.Player(data);
            entityManager.levelUp(model);
        });

        // スキルのキャストを開始したよって
        this.socket.on('notify:skill:cast:start', function(data) {
            data.skill = new bq.model.Skill(data.skill);
            entityManager.cast(data);
        });

        // スキルが発動したよって
        this.socket.on('notify:skill:fire', function(data) {
            data.skill = new bq.model.Skill(data.skill);
            entityManager.fireSkill(data);
        });

        /**
         *  1対1の通信
         */
        // 経験値貰ったよって
        this.socket.on('user:status:exp:update', function(data) {
            bq.player.updateExp(data);
        });

        // BPに変動があったよって
        this.socket.on('user:status:bp:update', function(data) {
            bq.player.updateBp(data);
        });

        // BPが足りないよって
        this.socket.on('user:status:bp:lack', function(data) {
            if (!this.isLackMsgShowing_) {
                this.isLackMsgShowing_ = true;
                bq.Hud.getInstance().addInstantMsg('BPが不足しています。', 1000, cc.color(255, 0, 0));
                bq.soundManager.playEffect(s_SeError);
                setTimeout(_.bind(function() {
                    this.isLackMsgShowing_ = false;
                }, this), 1200);
            }
        });
    },

    /**
     * ログインを試みる。レスポンスが返ってきたらcallbackを実行する
     * @param {string} userId
     * @param {string} hash
     * @param {Function} callback
     * @param {Object} selfObj
     */
    tryLogin: function(userId, hash, callback, selfObj) {
        this.socket.emit('login', {userId: userId, hash: hash});
        this.socket.once('login:receive', $.proxy(callback, selfObj));
    },

    /**
     * @param {Object} chatData
     */
    sendChat: function(chatData) {
        this.socket.emit('message:update', chatData);
    },

    /**
     * プレイヤーの絶対座標をサーバに送信する
     * @param {Object.<userId: number, mapId: number, x: number, y: number>} pos
     */
    sendPlayerPosition: function(pos) {
        this.socket.emit('user:position:update', pos);
    },

    /**
     * @param {Object.<tag: string, shooterId: number, beamId: number, mapId: number, x: number, y: number>} pos
     */
    sendBeamPosition: function(pos) {
        this.socket.emit('beam:position:update', pos);
    },

    /**
     * 復活したよって伝える
     */
    sendRespawn: function(player) {
        this.socket.emit('user:respawn', player);
    },

    /**
     * マップ上に存在する全Entityの一覧を要求する
     * @param {number} mapId
     * @param {Function} callback
     * @param {Object} selfObj
     */
    requestEntitiesByMapId: function(mapId, callback, selfObj) {
        this.socket.emit('world:entities:get', {mapId: mapId});
        this.socket.once('world:entities:receive', $.proxy(callback, selfObj));
    },

    /**
     * マップ上に存在するドロップアイテムの一覧を要求する
     * @param {number} mapId
     * @param {Function} callback
     * @param {Object} selfObj
     */
    requestDropItemsByMapId: function(mapId, callback, selfObj) {
        this.socket.emit('world:dropitems:get', {mapId: mapId});
        this.socket.once('world:dropitems:receive', $.proxy(callback, selfObj));
    },

    /**
     * いまからスキル使うよってサーバに伝える
     * @param {string} skillId スキルID
     * @param {string} userId 使用者のID
     * @param {bq.model.Position|Object} position
     * @param {string=] opt_targetId 座標指定ではなくターゲット指定型の場合は座標よりこちらが優先される
     */
    castSkill: function(skillId, userId, position, opt_targetId) {
        var data = {
            skillId: skillId,
            userId: userId,
            position: position,
            targetId: opt_targetId || null
        };
        this.socket.emit('skill:cast', data);
    },

    /**
     * いまからビーム撃つよってサーバに伝える
     * @param {Object.<shooterId: number, mapId: number, src: cc.p, dest: cc.p, beamId: string, tag: string} beamPos
     */
    shootBeam: function(beamPos) {
        this.socket.emit('beam:shoot', beamPos);
    },

    /**
     * entityのステータスを要求する
     * @param {string} entityId
     * @param {Function} callback
     * @param {Object} selfObj
     */
    requestEntityStatus: function(entityId, callback, selfObj) {
        this.socket.emit('user:status:get', {entityId: entityId});
        this.socket.once('user:status:receive', $.proxy(callback, selfObj));
    },

    /**
     * ドロップアイテムを拾い上げる
     * @param {bq.Types.Items} dropId
     * @param {string} mapId
     * @param {string} pickerId
     */
    requestPickItem: function(dropId, mapId, pickerId) {
        var data = {
            'dropId': dropId,
            'mapId': mapId,
            'pickerId': pickerId
        };
        this.socket.emit('item:pick', data);
    }
});

bq.Socket.instance_ = new bq.Socket();

bq.Socket.getInstance = function() {
    return bq.Socket.instance_;
};
