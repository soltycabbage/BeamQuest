/**
 * サーバ側のmodel.Positionに対応するmodel
 */
bq.model.Position = bq.model.extend({
    ctor: function(json) {
        /** @type {number} */
        this.x;

        /** @type {number} */
        this.y;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.x = json['x'];
        this.y = json['y'];
    }
});