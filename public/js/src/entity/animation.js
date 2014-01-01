/**
 * Created by iwag on 2013/12/31.
 */

bq.Animation = {};
// todo bq.entity.animation

/**
 * Jsonからアニメーションのマップを返す
 */
bq.Animation.createAnimations = function (keyFrameMap) {
    // var data = loadJson(filename);

    var animations = {};
    for (var k in keyFrameMap) {
        var keyFrames = keyFrameMap[k];
        animations[k] = bq.Animation.createAnimation_(keyFrames);
    }

    return animations;
};

bq.Animation.createAnimation_ = function (frames) {
    var animation = cc.Animation.create();
    animation.setDelayPerUnit(0.1);

    var frameCache = cc.SpriteFrameCache.getInstance();
    _.forEach(frames, function (i) {
        var frame = frameCache.getSpriteFrame(i);
        animation.addSpriteFrame(frame);
    }, this);


    return animation;
};
