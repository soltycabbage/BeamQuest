/// <reference path="../../../typings/tsd.d.ts" />

import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import Skill = require('beamQuest/skill/skill');


/**
 * バーンストライク
 */
class BurnStrike extends Skill {
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
            // todo: ダメージ計算、クリティカル判定
            var damage = 10 + Math.floor(10 * Math.random());
            var iscritical = false;
            if (Math.floor(Math.random() * 100) < 20) { // とりあえずクリティカル率20％
                iscritical = true;
                damage *= 2;
            }
            this.applyDamage(damage, iscritical);
        }, 500);
    }
}

export = BurnStrike;
