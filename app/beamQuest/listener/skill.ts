import EntityStore = require('beamQuest/store/entities');
import UserStore = require('beamQuest/store/userStore');
import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import PlayerCtrl = require('beamQuest/ctrl/player');
import SkillFactory = require('beamQuest/factory/skillFactory');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */
var socket_;
var io_;

export function listen(socket, io) {
    socket_ = socket;
    io_ = io;
    socket_.on('skill:cast', handleCastSkill_.bind(this));
}

/**
 * プレイヤーからのスキル使用要求
 * @param {Object.<skillId: string, userId: string, position: model.Position>} data
 */
function handleCastSkill_(data) {
    if (io_ && data && data.skillId && data.position) {
        var player:any = EntityStore.getPlayerById(data.userId);
        if (!player) { return; }
        var skills:SkillModel[] = player.model.skills;
        var targetSkill:SkillModel = _.find(skills, (skill) => {
            return skill.id === data.skillId;
        });
        if (targetSkill && canUse(targetSkill, player)) {
            var result = {
                userId: player.model.id,
                skill: targetSkill
            };
            io_.sockets.emit('notify:skill:cast:start', result);

            // キャストタイム終了後、スキル使用者のBPを減らす。
            // キャストが中断されない前提。
            setTimeout(() => {
                var s = SkillFactory.getInstance().create(targetSkill, player, data.position);
                s && s.fire();
            }, targetSkill.castTime);
        }
    }
}

/**
 * @param {!model.Skill} model
 * @param {string} userId
 * @param {!model.Position} targetPos
 */
export function fire(model:SkillModel, userId, targetPos:PositionModel): void {
    if (io_) {
        var data = {
            skill: model,
            userId: userId,
            targetPos: targetPos
        };
        io_.sockets.emit('notify:skill:fire', data);
    }
}

/**
 * そのスキルor使用者のリキャストタイムとか残りBPとかを見て使用可能かどうかを返す
 * @param {model.Skill} skill
 * @param {ctrl.Player} user
 * @return {boolean} スキル使用可能ならtrue
 * @private
 */
function canUse(skill:SkillModel, user:PlayerCtrl): boolean {
    // BPが足りなかったらfalse
    if (skill.bp > user.model.bp) {
        if (socket_) {
            socket_.emit('user:status:bp:lack');
        }

        return false;
    }
    return true;
    // TODO: クールタイムをチェック
}
