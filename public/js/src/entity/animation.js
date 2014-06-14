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
        var animation = bq.entity.Animation.createAnimation(keyFrames);
        var animate = cc.Animate.create(animation);
        animations[k] = cc.RepeatForever.create(animate);
    }

    return animations;
};

bq.entity.Animation.createAnimation = function (frames, delay) {
    var animation = cc.Animation.create();
    animation.setDelayPerUnit(delay || 0.1);

    _.forEach(frames, function (i) {
        var frame = cc.spriteFrameCache.getSpriteFrame(i);
        if ( !frame ) {
            cc.log("frame is "+frame);
        } else {
            animation.addSpriteFrame(frame);
        }
    }, this);

    return animation;
};
