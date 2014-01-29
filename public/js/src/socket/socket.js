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
            entityManager.beamShoot(beamPos);
        });

        // ビームヒット
        this.socket.on('notify:beam:hit', function(data) {
            entityManager.hitEntity(data);
        });

        this.socket.on('notify:user:logout', function(data) {
            // TODO ログアウト時の動作
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

        // mobが近接攻撃の構えを取った
        this.socket.on('notify:entity:mob:startAttackShortRange', function(data) {
            entityManager.startAttackShortRange(data);
        });

        // hpに変動があった
        this.socket.on('notify:entity:hp:update', function(data) {
            entityManager.updateHp(data);
        });

        /**
         *  1対1の通信
         */
        // 経験値貰ったよって
        this.socket.on('user:status:exp:update', function(data) {
            bq.player.popExpLabel(data.exp);
            // TODO:システムメッセージに表示する。
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
     * いまからビーム撃つよってサーバに伝える
     * @param {Object.<shooterId: number, mapId: number, src: cc.p, dest: cc.p, beamId: string, tag: string} beamPos
     */
    shootBeam: function(beamPos) {
        this.socket.emit('beam:shoot', beamPos);
    }

});

bq.Socket.instance_ = new bq.Socket();

bq.Socket.getInstance = function() {
    return bq.Socket.instance_;
};
