/**
 * サーバ側のmodel.Positionに対応するmodel
 * @constructor
 * @extends {bq.model}
 */
bq.model.Position = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.mapId;

        /** @type {number} */
        this.x;

        /** @type {number} */
        this.y;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.mapId = json['mapId'];
        this.x = json['x'];
        this.y = json['y'];
    }
});