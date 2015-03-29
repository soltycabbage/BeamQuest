import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import EntityCtrl = require('beamQuest/ctrl/entity');
import MobCtrl = require('beamQuest/ctrl/mob/mob');
import EntityStore = require('beamQuest/store/entities');

declare var bq: any;

/**
 * @constructor
 * @param {!model.Skill} model
 * @param {!ctrl.Entity} user
 * @param {!model.Position} targetPos
 */
class Skill {
    /**
     * @type {!ctrl.Entity} スキル使用者
     * @protected
     */
    user:EntityCtrl;

    /**
     * @type {model.Skill}
     * @protected
     */
    model:SkillModel;

    /**
     * @type {model.Position}
     * @protected
     */
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
     * @param {boolean=} opt_isCritical
     */
    applyDamage(damage:number, opt_isCritical?:boolean) {
        var entities = [];
        if (this.user.model.type === bq.Types.EntityType.PLAYER) {
            entities = this.getMobsByRadius();
        }

        _.forEach(entities, (entity) => {
            if (entity && entity.model) {
                entity.model.addHp(-damage, !!opt_isCritical);
                if (entity instanceof MobCtrl) {
                    entity.hateList && entity.applyHate(this.user.model.id, damage);
                }
            }
        });
    }

    /**
     * 指定座標を中心とする半径radiusの円内に含まれるMobを返す
     * @return {Array.<ctrl.Entity>}
     */
    getMobsByRadius(): EntityCtrl[] {
        return EntityStore.getInstance().getMobsByRadius(this.targetPos, this.model.radius);
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
