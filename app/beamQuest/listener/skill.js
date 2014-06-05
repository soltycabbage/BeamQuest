var mapStore = require('beamQuest/store/maps'),
    entityStore = require('beamQuest/store/entities');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

var Skill = function() {
};

Skill.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;

    this.socket_.on('skill:cast', this.handleCastSkill_.bind(this));
};

/**
 * プレイヤーからのスキル使用要求
 * @param {Object} data
 * @private
 */
Skill.prototype.handleCastSkill_ = function(data) {
    if (this.io_ && data && data.skillId && data.position) {
        var player = entityStore.getPlayerById(data.position.mapId, data.userId);
        if (!player) { return; }
        var skills = player.model.skills;
        var targetSkill = _.find(skills, function(skill) {
            return skill.id === data.skillId;
        });
        if (targetSkill && this.canUse_(targetSkill, player)) {
            var result = {
                mapId: player.model.position.mapId,
                userId: player.model.id,
                skill: targetSkill
            };
            this.io_.sockets.emit('notify:skill:cast:start', result);
        }
    }
};

/**
 * そのスキルor使用者のリキャストタイムとか残りBPとかを見て使用可能かどうかを返す
 * @param {model.Skill} skill
 * @param {ctrl.User} user
 * @return {boolean} スキル使用可能ならtrue
 * @private
 */
Skill.prototype.canUse_ = function(skill, user) {
    // BPが足りなかったらfalse
    if (skill.bp > user.model.bp) {
        return false;
    }
    return true;
    // TODO: クールタイムをチェック
};

var instance_ = new Skill();
module.exports = instance_;
