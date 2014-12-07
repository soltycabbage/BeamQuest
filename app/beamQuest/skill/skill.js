var PlayerCtrl = require('beamQuest/ctrl/player');
var MobCtrl = require('beamQuest/ctrl/mob/mob');
var EntityStore = require('beamQuest/store/entities');
/**
 * @constructor
 */
var Skill = (function () {
    function Skill(model, user, targetPos) {
        this.user = user;
        this.model = model;
        this.targetPos = targetPos;
        this.skillListener = require('beamQuest/listener/skill').getInstance();
    }
    /**
     * スキルを実行する
     */
    Skill.prototype.fire = function () {
        // BPを減らす。BPの概念があるのはプレイヤーのみ
        if (this.user instanceof PlayerCtrl) {
            this.user.model.addBp(-this.model.bp);
        }
        this.skillListener.fire(this.model, this.user.model.id, this.targetPos);
    };
    /**
     * 効果範囲内にダメージを与える
     * @param {number} damage
     * @param {number=} opt_criticalProb クリティカル率
     */
    Skill.prototype.applyDamage = function (damage, opt_criticalProb) {
        var _this = this;
        var entities = [];
        var isCritical = false;
        var criticalProb = opt_criticalProb || 0;
        if (Math.floor(Math.random() * 100) < criticalProb) {
            isCritical = true;
            damage *= 2;
        }
        if (this.user.model.type === bq.Types.EntityType.PLAYER) {
            entities = this.getMobsByRadius();
        }
        _.forEach(entities, function (entity) {
            if (entity && entity.model) {
                entity.model.addHp(-damage, !!isCritical);
                if (entity instanceof MobCtrl) {
                    entity.hateList && entity.applyHate(_this.user.model.id, damage);
                }
            }
        });
    };
    /**
     * 指定座標を中心とする半径radiusの円内に含まれるMobを返す
     * @return {Array.<ctrl.Entity>}
     */
    Skill.prototype.getMobsByRadius = function () {
        return EntityStore.getInstance().getMobsByRadius(this.targetPos, this.model.radius);
    };
    /**
     * 指定座標を中心とする半径radiusの円内に含まれるPlayerを返す
     * @return {Array.<ctrl.Entity>}
     */
    Skill.prototype.getPlayersByRadius = function () {
        return EntityStore.getInstance().getPlayersByRadius(this.targetPos, this.model.radius);
    };
    return Skill;
})();
module.exports = Skill;
//# sourceMappingURL=skill.js.map