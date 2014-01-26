bq.model.Player = bq.model.Entity.extend({
    ctor: function(json) {
        /** @type {number} */
        this.maxBp;

        /** @type {number} */
        this.bp;

        /** @type {number} */
        this.exp;

        /** @type {number} */
        this.lv;

        this._super(json);
    },

    parse: function(json) {
        this._super(json);
        this.maxBp = json['maxBp'];
        this.bp = json['bp'];
        this.exp = json['exp'];
        this.lv = json['lv'];
    }
});