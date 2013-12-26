/**
 * @fileoverview チャット情報
 */
bq.model.Chat = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.userId;

        /** @type {string} */
        this.text;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.userId = json['userId'];
        this.message = json['message'];
    }
});