/**
 * @constructor
 * @extends {bq.model}
 */
bq.model.PlayerMove = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.userId;

        /** @type {number} */
        this.mapId;

        /** @type {number} */
        this.x;

        /** @type {number} */
        this.y;

        /** @type {bq.entity.EntityState.Direction} */
        this.direction;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.userId = json['userId'];
        this.mapId = json['mapId'];
        this.x = json['x'];
        this.y = json['y'];
        this.direction = json['direction'];
    }
});