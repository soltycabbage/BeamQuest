var util = require('util'),
    Skill = require('beamQuest/skill/skill');

/**
 * バーンストライク
 * @constructor
 * @extends {skill.Skill}
 */
var BurnStrike = function(model, user, targetPos) {
    Skill.apply(this, arguments);

    this.interval_ = null;

    this.dotCount_ = 0;

    this.maxDotCount_ = 10;
};
util.inherits(BurnStrike, Skill);


/** @override */
BurnStrike.prototype.fire = function() {
    BurnStrike.super_.prototype.fire.apply(this);

    this.interval_ = setInterval(_.bind(function() {
        if (this.dotCount_++ > this.maxDotCount_) {
            clearInterval(this.interval_);
        }
        // TODO: ダメージ計算、クリティカル判定
        var damage = 10 + Math.floor(10 * Math.random());
        var isCritical = false;
        if (Math.floor(Math.random() * 100) < 20) { // とりあえずクリティカル率20％
            isCritical = true;
            damage *= 2;
        }
        this.applyDamage(damage, isCritical);
    }, this), 500);
};


module.exports = BurnStrike;