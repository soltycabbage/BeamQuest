bq.model = cc.Class.extend({
    ctor: function(json) {
        this.parse(json);
    },

    parse: function(json) {
        // 各モデルでoverrideする
    }
});