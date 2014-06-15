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

    this.applyDamage(-10);
    this.interval_ = setInterval(_.bind(function() {
        if (this.dotCount_++ > this.maxDotCount_) {
            clearInterval(this.interval_);
        }
        this.applyDamage(-10);
    }, this), 500);
};


module.exports = BurnStrike;