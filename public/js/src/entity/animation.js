/**
 * Created by iwag on 2013/12/31.
 */

bq.Animation = {};

/**
 * Jsonからアニメーションのマップを返す
 */
bq.Animation.createAnimations = function (filename) {
    // var data = loadJson(filename);
    var data = { "act": ["b0_1.png", "b0_2.png"]};

    var animations = {};
    for (var k in data) {
        var keyFrames = data[k];
        animations[k] = bq.Animation.createAnimation_(keyFrames);
    }
};

bq.Animation.createAnimation_ = function (frames) {
    var animation = cc.Animation.create();
    animation.setDelayPerUnit(this.animationSpeed);

    var frameCache = cc.SpriteFrameCache.getInstance();
    _.forEach(frames, function (i) {
        var frame = frameCache.getSpriteFrame(i);
        animation.addSpriteFrame(frame);
    }, this);


    return animation;
};
