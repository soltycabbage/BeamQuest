var Player = cc.Sprite.extend({
    moveSpeed: 2, // 1frameの移動量(px)
    ctor:function (fileName, rect) {
        this._super();
        this.initWithFile(fileName, rect);
    }
});