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
        }, this));
    },

    /**
     * @return {Object}
     */
    getOtherPlayers: function() {
        return this.otherPlayers_;
    },

    /**
     * 他プレイヤーのチャットを受信したら吹き出しを表示する
     * @param {bq.model.Chat} chatData
     */
    chat: function(chatData) {
        var targetOther = this.otherPlayers_[chatData.userId];
        targetOther.showMessage(chatData.message);
    },

    /**
     * 他プレイヤーが動いたという情報がサーバから帰ってきたら呼ばれる
     * @param {bq.model.PlayerMove} moveData
     */
    moveTo: function(moveData) {
        if (!this.otherPlayers_[moveData.userId]) {
            this.createOtherPlayer(moveData);
        } else {
            var act = cc.MoveTo.create(0.2, cc.p(moveData.x, moveData.y));
            var otherPlayer = this.otherPlayers_[moveData.userId];
            otherPlayer.runAction(act);
        }
    },

    /**
     * ビーム発射
     * @param {bq.model.BeamPos} beamPos
     */
    beamShoot: function(beamPos) {
        // TODO: ほんとはここじゃなくてentityに定義されたshoot()関数的なやつを呼ぶのがいい。
        var beam = bq.Beam.create(beamPos.beamId);
        bq.baseLayer.addChild(beam, 10);
        cc.AudioEngine.getInstance().playEffect(s_SeBeamA);
        beam.initDestination(beamPos.src, beamPos.dest);
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
        var other = new bq.entity.Entity('b0_0.png');
        other.name = moveData.userId;
        other.showName(moveData.userId, true);
        other.setPosition(cc.p(moveData.x, moveData.y));
        bq.baseLayer.addChild(other);
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
        var x = mob.position.x;
        var y = mob.position.y;
        var enemy_id = 1;
        var enemy = new bq.entity.Enemy(enemy_id);
        enemy.setPosition(cc.p(x, y));
        bq.baseLayer.addChild(enemy, 50);

    }
});


bq.EntityManager.instance_ = new bq.EntityManager();

bq.EntityManager.getInstance = function() {
    return bq.EntityManager.instance_;
};
