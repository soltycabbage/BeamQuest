var Player = Entity.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    ctor:function (fileName, rect) {
        this._super(fileName, rect);
    }
});