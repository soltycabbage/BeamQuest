bq.model.Player = bq.model.Entity.extend({
    ctor: function(json) {
        /** @type {number} */
        this.maxBp;

        /** @type {number} */
        this.bp;

        /**
         * 現在の経験値
         * @type {number}
         */
        this.exp;

        /**
         * 次のレベルまでに必要な経験値
         * @type {number}
         */
        this.nextExp;

        /** @type {number} */
        this.lv;

        this._super(json);
    },

    /**
     * @param {number} exp
     */
    addExp: function(exp) {
        this.exp += exp;
    },

    parse: function(json) {
        this._super(json);
        this.maxBp = json['maxBp'];
        this.bp = json['bp'];
        this.exp = json['exp'];
        this.nextExp = json['nextExp'];
        this.lv = json['lv'];
    }
});