/**
 * @fileoverview ビームの基底クラス
 */

/**
 *
 * @type {*|void|Object|Function}
 */
var Beam = cc.Node.extend({
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
     * destまで飛ぶように設定する。呼び出したあとは画面に表示されて飛ぶ
     * @param {cc.p} dest
     */
    initDestination: function (dest) {
        "use strict";
        this.setVisible(true);
        this.active_ = true;
        this.destination_ = dest;
        this.inc_.x = dest.x * this.speed_;
        this.inc_.y = dest.y * this.speed_;

        // duration秒後にこのビームがdisableになるアクションを追加
        var duration = 5;
        var remove = cc.CallFunc.create(this.disable_, this);
        var seq = cc.Sequence.create( cc.FadeIn.create(duration) , remove);
        this.runAction(seq);
    },

    /**
     * このビームをフィールドから消して次使えるように準備する
     * @private
     */
    disable_: function() {
        this.setVisible(false);
        this.active_ = false;
    }

});

/**
 * プリセットからビームを取り出す
 * @returns {Beam} プリセットされたビームを返す、キャッシュされたビームが尽きていた場合は不定（今のところnullを返す）
 */
Beam.pop = function() {
    "use strict";
    if (bq.beams.length <= 0 ) {
        return null;
    }
    var be =  _.find(bq.beams, function(b) { return !b.active_;} );
    if ( be == undefined ) {
        return null;
    }
    return be;
},

/**
 * Beamのファクトリ
 * 引数id にあうパーティクルのビームを作成する
 *
 * @param {number} id
 * @returns {Beam}
 */
Beam.create = function(id) {
    "use strict";
    var beam =  new Beam(id);

    // パーティクルをセット
    var particle = null;
    switch (id) {
        case 0:
            particle = cc.ParticleMeteor.create();
            break;
        case 1:
            particle = cc.ParticleFlower.create();
            break;
    }

    var myTexture = cc.TextureCache.getInstance().textureForKey(s_beam0);
    particle.setTexture(myTexture);

    beam.addChild(particle);
    beam.setPosition(cc.p(0,0));

    beam.speed_ = 0.1;

    return beam;
};

/**
 * idなビームをsetupする
 * プレイヤが武器を変更した瞬間などに呼ばれる。
 * @param id
 * @param layer {cc.Layer}
 */
Beam.setup = function(id, layer) {
    "use strict";

    var maxBeamCount = 2;
    _.times(maxBeamCount, function(i) {
        var beam = Beam.create(id);
        bq.beams[i] = beam;
        layer.addChild(beam, 10);
    });

};
