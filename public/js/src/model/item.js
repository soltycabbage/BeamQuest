bq.model.Item = bq.model.extend({
    ctor: function(json) {
        /** @type {bq.Types.Items} */
        this.id;

        /** @type {string} */
        this.name;

        /** @type {string} */
        this.info;

        /** @type {bq.model.ItemType} */
        this.type;

        this._super(json);
    },

    /** @override */
    parse: function(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.info = json['info'];
        this.type = json['type'];
    }
});