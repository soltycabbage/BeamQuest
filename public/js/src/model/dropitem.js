bq.model.DropItem = bq.model.extend({
    ctor: function(json) {
        /** @type {string} */
        this.dropId;

        /** @type {bq.Types.Items} */
        this.itemId;

        /** @type {number} */
        this.num;

        /** @type {string} */
        this.dropperId;

        /** @type {number} */
        this.droppedAt;

        /** @type {bq.model.Position} */
        this.position;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.dropId = json['dropId'];
        this.itemId = json['itemId'];
        this.num = json['num'];
        this.dropperId = json['dropperId'];
        this.droppedAt = json['droppedAt'];
        this.position = new bq.model.Position(json['position']);
    }
});