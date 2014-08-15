var PlayerCtrl = require('beamQuest/ctrl/player');
var MobCtrl = require('beamQuest/ctrl/mob/mob');
var EntityStore = require('beamQuest/store/entities');

/**
* @constructor
* @param {!model.Skill} model
* @param {!ctrl.Entity} user
* @param {!model.Position} targetPos
*/
var Skill = (function () {
    function Skill() {
    }
    Skill.prototype.construcor = function (model, user, targetPos) {
        this.user = user;
        this.model = model;
        this.targetPos = targetPos;
    };

    /**
    * スキルを実行する
    */
    Skill.prototype.fire = function () {
        // BPを減らす。BPの概念があるのはプレイヤーのみ
        if (this.user instanceof PlayerCtrl) {
            this.user.model.addBp(-this.model.bp);
        }

        require('beamQuest/listener/skill').fire(this.model, this.user.model.id, this.targetPos);
    };

    /**
    * 効果範囲内にダメージを与える
    * @param {number} damage
    * @param {boolean=} opt_isCritical
    */
    Skill.prototype.applyDamage = function (damage, opt_isCritical) {
        var _this = this;
        var entities = [];
        if (this.user.model.type === bq.Types.EntityType.PLAYER) {
            entities = this.getMobsByRadius();
        }

        _.forEach(entities, function (entity) {
            if (entity && entity.model) {
                entity.model.addHp(-damage, !!opt_isCritical);
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
