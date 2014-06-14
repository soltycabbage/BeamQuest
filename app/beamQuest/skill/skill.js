var PlayerCtrl = require('beamQuest/ctrl/player');

/**
 * @constructor
 * @param {!model.Skill} model
 * @param {!ctrl.Entity} user
 * @param {!model.Position} targetPos
 */
var Skill = function(model, user, targetPos) {
    /**
     * @type {!ctrl.Entity} スキル使用者
     * @private
     */
    this.user_ = user;

    /**
     * @type {model.Skill}
     * @private
     */
    this.model_ = model;

    /**
     * @type {model.Position}
     * @private
     */
    this.targetPos_ = targetPos;

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
    if (this.user_ instanceof PlayerCtrl) {
        this.user_.model.addBp(-this.model_.bp);
    }

    this.listener_.fire(this.model_, this.user_.model.id, this.targetPos_);
};

module.exports = Skill;