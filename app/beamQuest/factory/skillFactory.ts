import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import BurnStrike = require('beamQuest/skill/burnStrike');
import BioShock = require('beamQuest/skill/bioShock');

declare var bq: any;

/**
 * スキルmodelに該当するskillクラスをnewして返す
 * @param {!model.Skill} skillModel スキルmodel
 * @param {!ctrl.Entity} user スキル使用者
 * @param {!model.Position} targetPos スキルのターゲット座標
 */
export function create(skillModel:SkillModel, user:EntityCtrl, targetPos:PositionModel) {
    var s = bq.params.Skills;
    var clazz;

    switch(skillModel.id) {
        case s.BURNSTRIKE.id:
            clazz = BurnStrike;
            break;
        case s.BIOSHOCK.id:
            clazz = BioShock;
            break;
        default:
            return null;
    }

    if (clazz) {
        return new clazz(skillModel, user, targetPos);
    } else {
        return null;
    }
}
