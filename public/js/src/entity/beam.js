/**
 * @fileoverview ビームの基底クラス
 */

/**
 * @constructor
 * @extends {cc.Node}
 */
bq.Beam = cc.Node.extend({
    id: 0, /** ビームID */
    destination_:cc.p(0,0), /** {cc.p} 目標 */
    speed_:0.5, /** 進むスピード */
    inc_:cc.p(0,0), /** 1回のupdateで進ませるピクセル数（xとy方向) */
    active_:false, //boolean
    /** @override */
    ctor: function (id) {
        "use strict";
        this._super();
        this.setVisible(false);

        this.scheduleUpdate();
    },

    /** @override */
    update: function(dt) {
        "use strict";
        if ( this.active_ ) {

            var curr = this.getPosition();
            // ビームを少し進ませる
            this.setPosition(cc.p(curr.x + this.inc_.x, curr.y + this.inc_.y));
        }

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
        this.inc_.x = (dest.x - src.x) * this.speed_;
        this.inc_.y = (dest.y - src.y) * this.speed_;

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
},

/**
 * Beamのファクトリ
 * 引数id にあうパーティクルのビームを作成する
 *
 * @param {number} id
 * @return {bq.Beam}
 */
bq.Beam.create = function(id) {
    "use strict";
    var beam =  new bq.Beam(id);

    // パーティクルをセット
    var particle = null;
    switch (id) {
        case 0:
            particle = cc.ParticleMeteor.create();
            break;
        case 1:
            particle = cc.ParticleFlower.create();
            break;
        case 2:
            particle = cc.ParticleSun.create();
            break;
    }

    var myTexture = cc.TextureCache.getInstance().textureForKey(s_beam0);
    particle.setTexture(myTexture);
    particle.setPosition(cc.p(0, 0));
    beam.addChild(particle);
    beam.speed_ = 0.05;
    beam.disable();

    return beam;
};

/**
 * idなビームをsetupする
 * プレイヤが武器を変更した瞬間などに呼ばれる。
 * @param {number} id
 * @param {cc.Layer} layer
 */
bq.Beam.setup = function(id, layer) {
    "use strict";

    var maxBeamCount = 5;
    _.times(maxBeamCount, function(i) {
        var beam = bq.Beam.create(id);
        bq.beams[i] = beam;
        layer.addChild(beam, 10);
    });

};

