import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import Skill = require('beamQuest/skill/skill');


/**
 * バイオショック
 * 対象にダメージ + 毒
 */
class BioShock extends Skill {
    private interval_;
    private dotcount_;
    private maxdotcount_;

    constructor(model:SkillModel, user:EntityCtrl, targetpos:PositionModel) {
        super(model, user, targetpos);
    }

    /** @override */
    fire() {
        super.fire();
        var damage = this.model.power + Math.floor(this.model.power * Math.random());
        this.applyDamage(damage, 10);
    }
}

export = BioShock;