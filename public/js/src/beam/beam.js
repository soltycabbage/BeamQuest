/**
 * @fileoverview ビームの基底クラス
 */
bq.beam = {};

/**
 * @constructor
 * @extends {cc.Node}
 */
bq.beam.Beam = cc.PhysicsSprite.extend({
    id: bq.Types.Beams.NORMAL0,   // ビームID
    tag: '',                     // ビーム識別用タグ
    destination_:cc.p(0,0),      // {cc.p} 目標
    inc_:cc.p(0,0),              // 1回のupdateで進ませるピクセル数（xとy方向)
    active_:false,               // 発射中ならtrue
    POSITION_SEND_INTERVAL: 0.1, // 位置情報を何秒ごとに送信するか
    prevPos_: {x: 0, y: 0},      // 前回送信時の座標
    enableSendPosition_: false,  // 位置情報を送信するかどうか
    shooterId_: null,            // ビームを打った人のID

    ctor: function (id, shooterId, tag) {
        "use strict";
        this._super();
        this.initWithSpriteFrameName("long1.png");
        this.setVisible(true);
        this.socket_ = bq.Socket.getInstance();
        this.shooterId_ = shooterId || null;
        if (shooterId === bq.player.name) {
            // 自分が撃ったビームだけサーバに位置情報を送信する
            // TODO: これもentityのshoot()的なメソッドでやるべき
            this.enableSendPosition(true);
        }

        // 物理てきなのを作る
        var body = new cp.Body(0.01, cp.momentForBox(1, 2, 2));
        this.setBody(body);
        bq.space && bq.space.addBody(this.getBody());
        this.shape_ = new cp.BoxShape(this.getBody(), 8, 8);
        this.shape_.setCollisionType(1); // FIXME fix magic number 他人の打ったビームの場合変えたほうがいいかも
        this.shape_.tag = tag;
        bq.space && bq.space.addShape(this.shape_);

        this.tag = tag;
        this.scheduleUpdate();
        this.schedule(this.sendPosition, this.POSITION_SEND_INTERVAL);
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
     * @param {number} speed スピード
     * @param {number} duration ビームの生存時間
     */
    initDestination: function (src, dest, speed, duration) {
        "use strict";
        this.enable();
        this.destination_ = dest;
        this.setPosition(src);
        var v = cc.pSub(dest, src);
        var vn = cc.pNormalize(v);
        this.inc_ = cc.pMult(vn, speed);

        var rotate = -1.0 * ( cc.RADIANS_TO_DEGREES(cc.pToAngle( this.inc_ )) -90);
        this.setRotation(rotate);

        // 力を与えてそっちに飛ばす TODO 他人が打ったビームの場合いらないかも
        this.getBody().applyImpulse(vn, cp.v(0, 0));

        // duration秒後にこのビームを消去する
        var remove = cc.CallFunc.create(this.dispose, this);
        var sequence = cc.Sequence.create(cc.DelayTime.create(3, v), remove);

        this.runAction(sequence);
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
        this.shape_ && bq.space.removeShape(this.shape_);
        this.removeFromParent();
    }
});

bq.beam.Beam.EventType = {
    REMOVE: 'remove'
};
