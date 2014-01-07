bq.model.Mob = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.id;

        /** @type {string} */
        this.name;

        /** @type {number} */
        this.maxHp;

        /** @type {number} */
        this.hp;

        /** @type {number} */
        this.exp;

        /** @type {cc.p} */
        this.position;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.maxHp = json['maxHp'];
        this.hp = json['hp'];
        this.exp = json['exp'];
        this.position = cc.p(json['position'].x, json['position'].y);
    }
});