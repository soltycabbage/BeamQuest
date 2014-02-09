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
        bq.soundManager.playEffect(s_SeBeamA);

        beam.initDestination(beamPos.src, beamPos.dest);
        $(beam).on(bq.beam.Beam.EventType.REMOVE, $.proxy(this.handleRemove_, this));
        this.beams_[beamPos.tag] = beam;
    },

    /**
     * @param {Event} evt
     * @private
     */
    handleRemove_: function(evt) {
        if (this.beams_[evt.currentTarget.tag]) {
            delete this.beams_[evt.currentTarget.tag];
        }
    },

    /**
     * @param {string} eamTag
     */
    disposeBeam: function(beamTag) {
        var beam = this.beams_[beamTag];
        beam && beam.dispose();
    }
});

bq.BeamManager.instance_ = new bq.BeamManager();

bq.BeamManager.getInstance = function() {
    return bq.BeamManager.instance_;
};
