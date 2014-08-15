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
            var mapId = UserStore.getInstance().getSessionData(this.socket_.id, 'mapId', (err, mapId) => {
                var player = EntityStore.getInstance().getPlayerById(mapId, data.userId);
                if (!player) { return; }
                var skills:SkillModel[] = player.model.skills;
                var targetSkill:SkillModel = _.find(skills, (skill) => {
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
                    setTimeout(() => {
                        var s = SkillFactory.getInstance().create(targetSkill, player, data.position);
                        s && s.fire();
                    }, targetSkill.castTime);
                }

            });
        }
    }

    /**
     * @param {!model.Skill} model
     * @param {string} userId
     * @param {!model.Position} targetPos
     */
        fire(model, userId, targetPos:PositionModel): void {
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
    canUse_(skill:SkillModel, user:PlayerCtrl): boolean{
        // BPが足りなかったらfalse
        if (skill.bp > user.model.bp) {
            return false;
        }
        return true;
        // TODO: クールタイムをチェック
    }
}

export = Skill;
