/**
 * @fileoverview Entity (player, mob, npc) の行動などなどを管理する
 */

bq.EntityManager = cc.Class.extend({
    otherPlayers_: [],
    enemys_: [],
    npcs_: [],
    ctor: function() {
    },

    /**
     * サーバからマップ上に存在するEntity一覧を取得してきて更新する
     * @param {number} mapId
     */
    updateEntitiesByMapId: function(mapId) {
       var soc = bq.Socket.getInstance();
        soc.requestEntitiesByMapId(1, function(data) {
            debugger;
        });
    },

    /**
     * @return {Array}
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
        if (!_.contains(this.otherPlayers_, moveData.userId)) {
            this.createOtherPlayer(moveData);
        } else {
            var act = cc.MoveTo.create(0.1, cc.p(moveData.x, moveData.y));
            var otherPlayer = this.otherPlayers_[moveData.userId];
            otherPlayer.runAction(act);
        }
    },

    createOtherPlayers: function() {

    },

    /**
     * @param {bq.model.PlayerMove} moveData
     */
    createOtherPlayer: function(moveData) {
        this.otherPlayers_.push(moveData.userId);
        var other = new Entity('b0_0.png');
        other.name = moveData.userId;
        other.showName(moveData.userId, true);
        other.setPosition(cc.p(moveData.x, moveData.y));
        bq.baseLayer.addChild(other);
        this.otherPlayers_[moveData.userId] = other;
    }
});


bq.EntityManager.instance_ = new bq.EntityManager();

bq.EntityManager.getInstance = function() {
    return bq.EntityManager.instance_;
};
