/**
 * サーバ側のmodel.Skillに対応するクライアント側のmodel
 * @class
 * @extends bq.model
 */
bq.model.Skill = bq.model.extend({
    ctor: function(json) {
        /** @type {number} */
        this.id;

        /**
         * 消費BP
         * @type {number}
         */
        this.bp;

        /**
         * スキル名
         * @type {string}
         */
        this.name;

        /**
         * スキルの説明文
         * @type {string}
         */
        this.info;

        /**
         * キャストタイム
         * @type {number}
         */
        this.castTime;

        /**
         * リキャストタイム
         * @type {number}
         */
        this.recastTime;

        /**
         * 射程距離
         * @type {number}
         */
        this.range;

        /**
         * 有効半径(px)
         * @type {number}
         */
        this.radius;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.info = json['info'];
        this.bp = json['bp'];
        this.castTime = json['castTime'];
        this.recastTime = json['recastTime'];
        this.range = json['range'];
        this.radius = json['radius'];
    }
});
