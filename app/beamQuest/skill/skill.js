var PlayerCtrl = require('beamQuest/ctrl/player'),
    entityStore = require('beamQuest/store/entities'),
    MobCtrl = require('beamQuest/ctrl/mob/mob');

/**
 * @constructor
 * @param {!model.Skill} model
 * @param {!ctrl.Entity} user
 * @param {!model.Position} targetPos
 */
var Skill = function(model, user, targetPos) {
    /**
     * @type {!ctrl.Entity} スキル使用者
     * @protecter
     */
    this.user = user;

    /**
     * @type {model.Skill}
     * @protected
     */
    this.model = model;

    /**
     * @type {model.Position}
     * @protected
     */
    this.targetPos = targetPos;

    /**
     * @type {listener.Skill}
     * @private
     */
    this.listener_ = require('beamQuest/listener/skill');
};

/**
 * スキルを実行する
 */
Skill.prototype.fire = function() {
    // BPを減らす。BPの概念があるのはプレイヤーのみ
    if (this.user instanceof PlayerCtrl) {
        this.user.model.addBp(-this.model.bp);
    }

    this.listener_.fire(this.model, this.user.model.id, this.targetPos);
};

/**
 * 効果範囲内にダメージを与える
 * @param {number} damage
 */
Skill.prototype.applyDamage = function(damage) {
    if (this.user.model.type === bq.Types.EntityType.PLAYER) {
        var entities = this.getMobsByRadius();
    }

    _.forEach(entities, _.bind(function(entity) {
        if (entity && entity.model) {
            entity.model.addHp(-damage);
            if (entity instanceof MobCtrl) {
                entity.hateList && entity.applyHate(this.user.model.id, damage);
            }
        }
    }, this));
};

/**
 * 指定座標を中心とする半径radiusの円内に含まれるMobを返す
 * @return {Array.<ctrl.Entity>}
 */
Skill.prototype.getMobsByRadius = function() {
    return entityStore.getMobsByRadius(this.targetPos, this.model.radius);
};

/**
 * 指定座標を中心とする半径radiusの円内に含まれるPlayerを返す
 * @return {Array.<ctrl.Entity>}
 */
Skill.prototype.getPlayersByRadius = function() {
    return entityStore.getPlayersByRadius(this.targetPos, this.model.radius);
};

module.exports = Skill;