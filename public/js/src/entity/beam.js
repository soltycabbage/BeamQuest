/**
 * @fileoverview ビームの基底クラス
 */

/**
 * @constructor
 * @extends {cc.Node}
 */
bq.Beam = cc.Node.extend({
    id: bq.Types.Beams.NORMAL,   // ビームID
    tag: '',                     // ビーム識別用タグ
    destination_:cc.p(0,0),      // {cc.p} 目標
    speed_:10,                   // 進むスピード
    inc_:cc.p(0,0),              // 1回のupdateで進ませるピクセル数（xとy方向)
    active_:false,               // 発射中ならtrue
    POSITION_SEND_INTERVAL: 3,   // 位置情報を何frameごとに送信するか
    positionSendCount_: 0,       // 位置情報送信用カウンター
    prevPos_: {x: 0, y: 0},      // 前回送信時の座標
    enableSendPosition_: false,  // 位置情報を送信するかどうか
    shooterId_: null,            // ビームを打った人のID

    ctor: function (id, shooterId, tag) {
        "use strict";
        this._super();
        this.setVisible(false);
        this.socket_ = bq.Socket.getInstance();
        this.shooterId_ = shooterId || null;
        if (shooterId === bq.player.name) {
            // 自分が撃ったビームだけサーバに位置情報を送信する
            // TODO: これもentityのshoot()的なメソッドでやるべき
            this.enableSendPosition(true);
        }
        this.tag = tag;
        this.scheduleUpdate();
    },

    /** @override */
    update: function(dt) {
        "use strict";
        if ( this.active_ ) {
            var curr = this.getPosition();
            // ビームを少し進ませる
            this.setPosition(cc.pAdd(curr, this.inc_));
            if (this.positionSendCount_++ > this.POSITION_SEND_INTERVAL) {
                this.positionSendCount_ = 0;
                this.sendPosition();
            }

        }

    },

    /**
     * @param {boolean} enabled
     */
    enableSendPosition: function(enabled) {
        this.enableSendPosition_ = !!enabled;
    },

    /**
     * ビームの現在座標をサーバに送信する
     */
    sendPosition: function() {
        if (!this.enableSendPosition_) {
            return;
        }
        var pos = this.getPosition();
        var posData = {
            tag: this.tag,
            shooterId: this.shooterId_,
            beamId: this.id,
            mapId: 1, // TODO マップID
            x: pos.x,
            y: pos.y
        };
        this.socket_.sendBeamPosition(posData);
    },

    /**
     * srcからdestまで飛ぶように設定する。呼び出したあとは画面に表示されて飛ぶ
     * @param {cc.p} src 発射開始座標
     * @param {cc.p} dest 到着予定座標
     */
    initDestination: function (src, dest) {
        "use strict";
        this.enable();
        this.destination_ = dest;
        this.setPosition(src);
        var v = cc.pSub(dest, src);
        var vn = cc.pNormalize(v);
        this.inc_ = cc.pMult(vn, this.speed_);

        // duration秒後にこのビームを消去する
        var duration = 2;
        var remove = cc.CallFunc.create(this.removeFromParent, this);
        var seq = cc.Sequence.create(cc.FadeIn.create(duration) , remove);
        this.runAction(seq);
    },

    enable: function() {
        this.setVisible(true);
        this.active_ = true;
    },

    /**
     * このビームをフィールドから消して次使えるように準備する
     */
    disable: function() {
        this.setVisible(false);
        this.active_ = false;
        this.inc_ = cc.p(0, 0);
    }
});

/**
 * プリセットからビームを取り出す
 * @return {bq.Beam} プリセットされたビームを返す、キャッシュされたビームが尽きていた場合は不定（今のところnullを返す）
 */
bq.Beam.pop = function() {
    "use strict";
    if (bq.beams.length <= 0 ) {
        return null;
    }
    var be =  _.find(bq.beams, function(b) { return !b.active_;} );
    if ( be == undefined ) {
        return null;
    }
    be.disable();
    return be;
};

/**
 * Beamのファクトリ
 * 引数id にあうパーティクルのビームを作成する
 *
 * @param {bq.Types.Beams} beamType
 * @param {string} shooterId
 * @param {string} tag
 * @return {bq.Beam}
 */
bq.Beam.create = function(beamType, shooterId, tag) {
    "use strict";
    var beam =  new bq.Beam(beamType, shooterId, tag);

    // パーティクルをセット
    var particle = null;
    var type = bq.Types.Beams;
    switch (beamType) {
        case type.NORMAL:
            particle = cc.ParticleMeteor.create();
            break;
        case type.FIRE:
            particle = cc.ParticleSun.create();
            break;
    }

    var myTexture = cc.TextureCache.getInstance().textureForKey(s_beam0);
    particle.setTexture(myTexture);
    particle.setPosition(cc.p(0, 0));
    beam.addChild(particle);
    beam.disable();

    return beam;
};

/**
 * idなビームをsetupする
 * プレイヤが武器を変更した瞬間などに呼ばれる。
 * @param {number} id
 * @param {cc.Layer} layer
 */
bq.Beam.setup = function(id, layer, shooterId) {
    "use strict";

    var maxBeamCount = 5;
    _.times(maxBeamCount, function(i) {
        var beam = bq.Beam.create(id, shooterId);
        bq.beams[i] = beam;
        layer.addChild(beam, 10);
    });

};
