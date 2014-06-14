var SkillFactory = function() {
};

/**
 * スキルmodelに該当するskillクラスをnewして返す
 * @param {!model.Skill} skillModel スキルmodel
 * @param {!ctrl.Entity} user スキル使用者
 * @param {!model.Position} targetPos スキルのターゲット座標
 */
SkillFactory.prototype.create = function(skillModel, user, targetPos) {
    var s = bq.params.Skills;
    var clazz;

    switch(skillModel.id) {
        case s.BURNSTRIKE.id:
            clazz = require('beamQuest/skill/burnStrike');
            break;
        default:
            return null;
    }

    if (clazz) {
        return new clazz(skillModel, user, targetPos);
    } else {
        return null;
    }
};


var instance_ = new SkillFactory();
module.exports = instance_;