var Player = Entity.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    ctor:function (fileName, rect) {
        this._super(fileName, rect);
    },

    /**
     * 各種値を設定する
     * @param {Object} data
     */
    setProfile: function(data) {
       this.name = data.name;
    }
});