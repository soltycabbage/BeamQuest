/**
 * サーバ側のmodel.Entityに対応するクライアント側のmodel
 */
bq.model.Entity = bq.model.extend({
    ctor: function(json) {
        /** @type {number} */
        this.id;

        /** @type {string} */
        this.name;

        /**
         * さいだいHP
         * @type {number}
         */
        this.maxHp;

        /**
         * 現在HP
         * @type {number}
         */
        this.hp;


        /** @type {bq.model.Position} */
        this.position;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.maxHp = json['maxHp'];
        this.hp = json['hp'];
        this.position = new bq.model.Position(json['position']);
    }
});