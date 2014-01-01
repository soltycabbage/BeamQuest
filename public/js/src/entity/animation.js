/**
 * Created by iwag on 2013/12/31.
 */

bq.entity.Animation = {};

/**
 * Jsonからアニメーションのマップを返す
 */
bq.entity.Animation.createAnimations = function (keyFrameMap) {
    // var data = loadJson(filename);

    var animations = {};
    for (var k in keyFrameMap) {
        var keyFrames = keyFrameMap[k];
        animations[k] = bq.entity.Animation.createAnimation_(keyFrames);
    }

    return animations;
};

bq.entity.Animation.createAnimation_ = function (frames) {
    var animation = cc.Animation.create();
    animation.setDelayPerUnit(0.1);

    var frameCache = cc.SpriteFrameCache.getInstance();
    _.forEach(frames, function (i) {
        var frame = frameCache.getSpriteFrame(i);
        animation.addSpriteFrame(frame);
    }, this);


    return animation;
};
