/**
 * Created by iwag on 2014/01/26.
 */
/**
 * オブジェクト関係
 */
bq.BeamManager = cc.Class.extend({
    beams_: {},
    /**
     *
     * @param {cc.TMXTiledMap} tileMap
     */
    ctor:function (tileMap) {
        'use strict';

        this.tileMap = tileMap;
    },

    /**
     * ビーム発射
     * @param {bq.model.BeamPos} beamPos
     */
    beamShoot: function(beamPos) {
        // TODO: ほんとはここじゃなくてentityに定義されたshoot()関数的なやつを呼ぶのがいい。
        var beam = bq.beam.Beam.create(beamPos.beamId, beamPos.shooterId, beamPos.tag);

        bq.baseLayer.addChild(beam, 10);
        cc.AudioEngine.getInstance().playEffect(s_SeBeamA);

        beam.initDestination(beamPos.src, beamPos.dest);
        $(beam).on(bq.beam.Beam.EventType.REMOVE, $.proxy(this.handleBeamRemove_, this));
        this.beams_[beamPos.tag] = beam;
    },

    // TODO とりあえずまー。beamManager的なのに移す
    disposeBeam: function(data) {
        var beam = this.beams_[data.beamTag];
        beam && beam.dispose();
    },


});

bq.BeamManager.instance_ = new bq.BeamManager();

bq.BeamManager.getInstance = function() {
    return bq.BeamManager.instance_;
};
