/**
 * @class
 * @extends bq.model
 */
bq.model.BeamPos = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.shooterId;

        /** @type {number} */
        this.mapId;

        /** @type {cc.p} */
        this.src;

        /** @type {cc.p} */
        this.dest;

        /** @type {string} */
        this.beamId;

        /** @type {number} */
        this.beamSpeed;

        /** @type {number} */
        this.beamDuration;

        /**
         * ビーム識別用タグ
         * @type {string}
         */
        this.tag;
        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.shooterId = json['shooterId'];
        this.mapId = json['mapId'];
        this.src = cc.p(json['src'].x, json['src'].y);
        this.dest = cc.p(json['dest'].x, json['dest'].y);
        this.beamId = json['beamId'];
        this.beamSpeed = json['beamSpeed'];
        this.beamDuration = json['beamDuration'];
        this.tag = json['tag'];
    }
});
