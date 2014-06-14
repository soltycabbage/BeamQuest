var util = require('util'),
    Skill = require('beamQuest/skill/skill');

/**
 * バーンストライク
 * @constructor
 * @extends {skill.Skill}
 */
var BurnStrike = function(model, user, targetPos) {
    Skill.apply(this, arguments);
};
util.inherits(BurnStrike, Skill);

module.exports = BurnStrike;