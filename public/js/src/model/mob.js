/**
 * @class
 * @extends bq.model.Entity
 */
bq.model.Mob = bq.model.Entity.extend({
    ctor: function(json) {
        /** @type {number} */
        this.exp;

        /** @type {cc.p} */
        this.position;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this._super(json);
        this.exp = json['exp'];
        this.position = cc.p(json['position'].x, json['position'].y);
    }
});