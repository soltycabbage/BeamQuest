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
};

/**
 * スキルを実行する
 */
Skill.prototype.fire = function() {
    // BPを減らす。BPの概念があるのはプレイヤーのみ
    if (this.user_ instanceof PlayerCtrl) {
        this.user_.model.addBp(-this.model_.bp);
    }

};

module.exports = Skill;