/// <reference path="../../../typings/tsd.d.ts" />

import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import PlayerSkill = require('beamQuest/skill/playerSkill');


/**
 * バーンストライク
 */
class BurnStrike extends PlayerSkill {
    private interval_;
    private dotcount_;
    private maxdotcount_;

    constructor(model:SkillModel, user:EntityCtrl, targetpos:PositionModel) {
        super(model, user, targetpos);

        this.interval_ = null;
        this.dotcount_ = 0;
        this.maxdotcount_ = 10;
    }

    /** @override */
    fire() {
        super.fire();

        this.interval_ = setInterval(() => {
            if (this.dotcount_++ > this.maxdotcount_) {
                clearInterval(this.interval_);
            }
            var damage = this.model.power + Math.floor(this.model.power * Math.random());
            this.applyDamage(damage, 20);
        }, 500);
    }
}

export = BurnStrike;
