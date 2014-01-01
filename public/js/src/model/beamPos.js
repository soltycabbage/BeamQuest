bq.model.BeamPos = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.userId;

        /** @type {number} */
        this.mapId;

        /** @type {cc.p} */
        this.src;

        /** @type {cc.p} */
        this.dest;

        /** @type {number} */
        this.beamId;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.userId = json['userId'];
        this.mapId = json['mapId'];
        this.src = cc.p(json['src'].x, json['src'].y);
        this.dest = cc.p(json['dest'].x, json['dest'].y);
        this.beamId = json['beamId'];
    }
});