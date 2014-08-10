var mapStore = require('beamQuest/store/maps'),
    entityStore = require('beamQuest/store/entities'),
    UserStore = require('beamQuest/store/userStore');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

var Skill = function() {
};

Skill.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;
    this.factory_ = require('beamQuest/factory/skillFactory');
    this.socket_.on('skill:cast', this.handleCastSkill_.bind(this));
};

/**
 * プレイヤーからのスキル使用要求
 * @param {Object.<skillId: string, userId: string, position: model.Position>} data
 * @private
 */
Skill.prototype.handleCastSkill_ = function(data) {
    if (this.io_ && data && data.skillId && data.position) {
        var mapId = UserStore.getInstance().getSessionData(this.socket_.id, 'mapId', function(err, mapId) {
            var player = entityStore.getPlayerById(mapId, data.userId);
            if (!player) { return; }
            var skills = player.model.skills;
            var targetSkill = _.find(skills, function(skill) {
                return skill.id === data.skillId;
            });
            if (targetSkill && this.canUse_(targetSkill, player)) {
                var result = {
                    mapId: mapId,
                    userId: player.model.id,
                    skill: targetSkill
                };
                this.io_.sockets.emit('notify:skill:cast:start', result);

                // キャストタイム終了後、スキル使用者のBPを減らす。
                // キャストが中断されない前提。
                data.position.mapId = mapId;
                setTimeout(_.bind(function() {
                    var s = this.factory_.create(targetSkill, player, data.position);
                    s && s.fire();
                }, this), targetSkill.castTime);
            }

        }.bind(this));
    }
};

/**
 * @param {!model.Skill} model
 * @param {string} userId
 * @param {!model.Position} targetPos
 */
Skill.prototype.fire = function(model, userId, targetPos) {
   if (this.io_) {
       var data = {
           skill: model,
           userId: userId,
           targetPos: targetPos
       };
       this.io_.sockets.emit('notify:skill:fire', data);
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
