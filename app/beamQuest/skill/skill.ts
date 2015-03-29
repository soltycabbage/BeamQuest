import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import MobCtrl = require('beamQuest/ctrl/mob/mob');
import EntityStore = require('beamQuest/store/entities');
import Buff        = require('beamQuest/buff/buff');

declare var bq: any;

/**
 * @constructor
 */
class Skill {
    // スキル使用者
    user:EntityCtrl;
    model:SkillModel;
    targetPos:PositionModel;

    private skillListener:any;

    constructor(model:SkillModel, user:EntityCtrl, targetPos:PositionModel) {
        this.user = user;
        this.model = model;
        this.targetPos = targetPos;

        this.skillListener = require('beamQuest/listener/skill').getInstance();
    }
    /**
     * スキルを実行する
     */
    fire() {
        this.skillListener.fire(this.model, this.user.model.id, this.targetPos);
    }

    /**
     * 効果範囲内にダメージを与える
     * @param {number} damage
     * @param {number=} opt_criticalProb クリティカル率
     */
    applyDamage(damage:number, opt_criticalProb?:number) {
        var entities = [];
        var isCritical = false;
        var criticalProb = opt_criticalProb || 0;
        if (Math.floor(Math.random() * 100) < criticalProb) {
            isCritical = true;
            damage *= 2;
        }

        if (this.user.model.type === bq.Types.EntityType.PLAYER) {
            entities = this.getMobsByRadius(this.targetPos, this.model.radius);
        }

        _.forEach(entities, (entity) => {
            if (entity && entity.model) {
                entity.model.addHp(-damage, !!isCritical);
                if (entity instanceof MobCtrl) {
                    entity.hateList && entity.applyHate(this.user.model.id, damage);
                }
            }
        });
    }

    /**
     * 対象にデバフを与える
     */
    applyDebuff(debuffClass:any) {
        var entities = this.getMobsByRadius(this.targetPos, this.model.radius);
        _.forEach(entities, (entity) => {
            if (entity) {
                entity.model.addDebuff(new debuffClass(entity));
            }
        });
    }

    /**
     * 指定座標を中心とする半径radiusの円内に含まれるMobを返す
     * @return {Array.<ctrl.Entity>}
     */
    getMobsByRadius(targetPos:PositionModel, radius:number): EntityCtrl[] {
        return EntityStore.getInstance().getMobsByRadius(targetPos, radius);
    }

    /**
     * 指定座標を中心とする半径radiusの円内に含まれるPlayerを返す
     * @return {Array.<ctrl.Entity>}
     */
    getPlayersByRadius(): EntityCtrl[] {
        return EntityStore.getInstance().getPlayersByRadius(this.targetPos, this.model.radius);
    }
}


export = Skill;
