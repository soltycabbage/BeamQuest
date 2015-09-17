import SkillModel = require('../model/skill');
import PositionModel = require('../model/position');
import EntityCtrl = require('../ctrl/entity');
import PlayerSkill = require('./playerSkill');
import Poison = require('../buff/poison');

/**
 * バイオショック
 * 対象にダメージ + 毒
 */
class BioShock extends PlayerSkill {
    constructor(model:SkillModel, user:EntityCtrl, targetpos:PositionModel) {
        super(model, user, targetpos);
    }

    /** @override */
    fire() {
        super.fire();
        var damage = this.model.power + Math.floor(this.model.power * Math.random());
        this.applyDamage(damage, 10);
        this.applyDebuff(Poison);
    }
}

export = BioShock;
