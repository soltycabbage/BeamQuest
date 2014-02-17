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
         * 前のレベルまでに必要な経験値
         * @type {number}
         */
        this.prevLvExp;

        /**
         * 次のレベルまでに必要な経験値
         * @type {number}
         */
        this.nextLvExp;

        /** @type {number} */
        this.lv;

        /** 装備してるビーム */
        this.beam;

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
        this.prevLvExp = json['prevLvExp'];
        this.nextLvExp = json['nextLvExp'];
        this.lv = json['lv'];
        this.beam = json['beam'];
    }
});
