import EntityStore = require('beamQuest/store/entities');
import UserStore = require('beamQuest/store/userStore');
import SkillModel = require('beamQuest/model/skill');
import PositionModel = require('beamQuest/model/position');
import PlayerCtrl = require('beamQuest/ctrl/player');
import SkillFactory = require('beamQuest/factory/skillFactory');

/**
 * @fileoverview アイテムの取得/ドロップなどなど
 */

class Skill {
    private static instance_:Skill;
    public static getInstance():Skill {
        if (Skill.instance_ === undefined) {
            Skill.instance_ = new Skill();
        }
        return Skill.instance_;
    }

    constructor() {
        if (Skill.instance_){
            throw new Error("Error: Instantiation failed: Use Skill.getInstance() instead of new.");
        }
        Skill.instance_ = this;
    }

    private socket_;
    private io_;

    listen(socket, io) {
        this.socket_ = socket;
        this.io_ = io;
        this.socket_.on('skill:cast', this.handleCastSkill_.bind(this));
    }

    /**
     * プレイヤーからのスキル使用要求
     * @param {Object.<skillId: string, userId: string, position: model.Position>} data
     */
    private handleCastSkill_(data) {
        if (this.io_ && data && data.skillId && data.position) {
            var player:any = EntityStore.getInstance().getPlayerById(data.userId);
            if (!player) { return; }
            var skills:SkillModel[] = player.model.skills;
            var targetSkill:SkillModel = _.find(skills, (skill) => {
                return skill.id === data.skillId;
            });
            if (targetSkill && this.canUse(targetSkill, player)) {
                var result = {
                    userId: player.model.id,
                    skill: targetSkill
                };
                this.io_.sockets.emit('notify:skill:cast:start', result);

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
    public fire(model:SkillModel, userId, targetPos:PositionModel): void {
        if (this.io_) {
            var data = {
                skill: model,
                userId: userId,
                targetPos: targetPos
            };
            this.io_.sockets.emit('notify:skill:fire', data);
        }
    }

    /**
     * そのスキルor使用者のリキャストタイムとか残りBPとかを見て使用可能かどうかを返す
     * @param {model.Skill} skill
     * @param {ctrl.Player} user
     * @return {boolean} スキル使用可能ならtrue
     * @private
     */
    private canUse(skill:SkillModel, user:PlayerCtrl): boolean{
        // BPが足りなかったらfalse
        if (skill.bp > user.model.bp) {
            if (this.socket_) {
                this.socket_.emit('user:status:bp:lack');
            }

            return false;
        }
        return true;
        // TODO: クールタイムをチェック
    }
}

export = Skill;
