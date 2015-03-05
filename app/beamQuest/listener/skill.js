var EntityStore = require('beamQuest/store/entities');
var UserStore = require('beamQuest/store/userStore');
var SkillFactory = require('beamQuest/factory/skillFactory');
/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */
var Skill = (function () {
    function Skill() {
        if (Skill.instance_) {
            throw new Error("Error: Instantiation failed: Use Skill.getInstance() instead of new.");
        }
        Skill.instance_ = this;
    }
    Skill.getInstance = function () {
        if (Skill.instance_ === undefined) {
            Skill.instance_ = new Skill();
        }
        return Skill.instance_;
    };
    Skill.prototype.listen = function (socket, io) {
        this.socket_ = socket;
        this.io_ = io;
        this.socket_.on('skill:cast', this.handleCastSkill_.bind(this));
    };
    /**
     * プレイヤーからのスキル使用要求
     * @param {Object.<skillId: string, userId: string, position: model.Position>} data
     */
    Skill.prototype.handleCastSkill_ = function (data) {
        var _this = this;
        if (this.io_ && data && data.skillId && data.position) {
            var mapId = UserStore.getInstance().getSessionData(this.socket_.id, 'mapId', function (err, mapId) {
                var player = EntityStore.getInstance().getPlayerById(mapId, data.userId);
                if (!player) {
                    return;
                }
                var skills = player.model.skills;
                var targetSkill = _.find(skills, function (skill) {
                    return skill.id === data.skillId;
                });
                if (targetSkill && _this.canUse(targetSkill, player)) {
                    var result = {
                        mapId: mapId,
                        userId: player.model.id,
                        skill: targetSkill
                    };
                    _this.io_.sockets.emit('notify:skill:cast:start', result);
                    // キャストタイム終了後、スキル使用者のBPを減らす。
                    // キャストが中断されない前提。
                    data.position.mapId = mapId;
                    setTimeout(function () {
                        var s = SkillFactory.getInstance().create(targetSkill, player, data.position);
                        s && s.fire();
                    }, targetSkill.castTime);
                }
            });
        }
    };
    /**
     * @param {!model.Skill} model
     * @param {string} userId
     * @param {!model.Position} targetPos
     */
    Skill.prototype.fire = function (model, userId, targetPos) {
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
     * @param {ctrl.Player} user
     * @return {boolean} スキル使用可能ならtrue
     * @private
     */
    Skill.prototype.canUse = function (skill, user) {
        // BPが足りなかったらfalse
        if (skill.bp > user.model.bp) {
            return false;
        }
        return true;
        // TODO: クールタイムをチェック
    };
    return Skill;
})();
module.exports = Skill;
//# sourceMappingURL=skill.js.map