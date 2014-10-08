/**
 * サーバ側のmodel.Entityに対応するクライアント側のmodel
 * @constructor
 * @extends {bq.model}
 */
bq.model.Entity = bq.model.extend({
    ctor: function(json) {
        /** @type {number} */
        this.id;

        /** @type {bq.Types.EntityType} */
        this.type;

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

        /** @type {Array.<bq.model.Skill>} */
        this.skills;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.id = json['id'];
        this.type = json['type'];
        this.name = json['name'];
        this.maxHp = json['maxHp'];
        this.hp = json['hp'];
        this.position = new bq.model.Position(json['position']);
        this.skills = this.parseArray(json['skills'], bq.model.Skill);
    }
});