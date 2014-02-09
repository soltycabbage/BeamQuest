/**
 * @fileoverview ビームの基底クラス
 */
bq.beam = {};

/**
 * @constructor
 * @extends {cc.Node}
 */
bq.beam.Beam = cc.Node.extend({
    id: bq.Types.Beams.NORMAL0,   // ビームID
    tag: '',                     // ビーム識別用タグ
    destination_:cc.p(0,0),      // {cc.p} 目標
    speed_:10,                   // 進むスピード
    inc_:cc.p(0,0),              // 1回のupdateで進ませるピクセル数（xとy方向)
    active_:false,               // 発射中ならtrue
    POSITION_SEND_INTERVAL: 0.1, // 位置情報を何秒ごとに送信するか
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
        this.schedule(this.sendPosition, this.POSITION_SEND_INTERVAL);
    },

    /** @override */
    update: function(dt) {
        "use strict";
        if ( this.active_ ) {
            var rotate = -1.0 * ( cc.RADIANS_TO_DEGREES(cc.pToAngle( this.inc_ )) -90);
            var curr = this.getPosition();
            // ビームを少し進ませる
            this.setPosition(cc.pAdd(curr, this.inc_));
            this.setRotation(rotate);
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
        var remove = cc.CallFunc.create(this.dispose, this);
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
    },

    dispose: function() {
        $(this).triggerHandler(bq.beam.Beam.EventType.REMOVE);
        this.removeFromParent();
    }
});

/**
 * プリセットからビームを取り出す
 * @return {bq.beam.Beam} プリセットされたビームを返す、キャッシュされたビームが尽きていた場合は不定（今のところnullを返す）
 */
bq.beam.Beam.pop = function() {
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

bq.beam.Beam.createParticleBeam = function(beamType, shooterId, tag) {
    "use strict";
    var beam =  new bq.beam.Beam(beamType, shooterId, tag);
    // パーティクルとテクスチャをセット
    // TODO これもっとうまく書く方法あるはずだし、別のクラスgameType?に移した方がいい
    var beamType2Partile = {};
    beamType2Partile[bq.Types.Beams.FIRE] = cc.ParticleSun;
    beamType2Partile[bq.Types.Beams.METEOR] = cc.ParticleMeteor;

    var particle = beamType2Partile[beamType];
    var myTexture = cc.TextureCache.getInstance().textureForKey(s_beam0);

    particle.setTexture(myTexture);
    particle.setPosition(cc.p(0,0));
    beam.addChild(particle);
    beam.disable();

    return beam;
};

bq.beam.Beam.createSpriteBeam = function(beamType, shooterId, tag) {
    "use strict";
    var beam =  new bq.beam.Beam(beamType, shooterId, tag);

    var beamType2textureName = {};
    // TODO これもっとうまく書く方法あるはずだし、別のクラスgameType?に移した方がいい
    beamType2textureName[ bq.Types.Beams.NORMAL0] =  ["large1.png","large2.png","large3.png","large4.png"];
    beamType2textureName[ bq.Types.Beams.NORMAL1] =  ["long1.png","long2.png","long3.png","long4.png"];
    beamType2textureName[ bq.Types.Beams.NORMAL2] =  ["small1.png","small2.png","small3.png"];

    var frames = beamType2textureName[beamType];

    var sp = cc.SpriteFrameCache.getInstance().getSpriteFrame("large1.png");
    var cl = cc.Sprite.createWithSpriteFrame(sp);

    var anime = bq.entity.Animation.createAnimation(frames, 0.05);
    var animation = anime && cc.RepeatForever.create(cc.Animate.create(anime));
    animation && cl.runAction(animation);

    beam.addChild(cl);
    beam.setPosition(cc.p(0,0));

    return beam;
};

/**
 * Beamのファクトリ
 * 引数id にあうパーティクルのビームを作成する
 *
 * @param {bq.Types.Beams} beamType
 * @param {string} shooterId
 * @param {string} tag
 * @return {bq.beam.Beam}
 */
bq.beam.Beam.create = function(beamType, shooterId, tag) {
    "use strict";
    var beam;

    var type = bq.Types.Beams;
    if (_.contains([type.FIRE, type.METEOR], beamType) ) {
        beam = bq.beam.Beam.createParticleBeam(beamType, shooterId, tag);
    } else {
        beam = bq.beam.Beam.createSpriteBeam(beamType, shooterId, tag);
    }


    beam.disable();

    return beam;
};

/**
 * idなビームをsetupする
 * プレイヤが武器を変更した瞬間などに呼ばれる。
 * @param {number} id
 * @param {cc.Layer} layer
 */
bq.beam.Beam.setup = function(id, layer, shooterId) {
    "use strict";

    var maxBeamCount = 1;
    _.times(maxBeamCount, function(i) {
        var beam = bq.beam.Beam.create(id, shooterId);
        bq.beams[i] && bq.beams[i].removeFromParent(true); // TODO need ?
        bq.beams[i] = beam;
        layer.addChild(beam, 10);
    });

};

bq.beam.Beam.EventType = {
    REMOVE: 'remove'
};
