import Skill = require('beamQuest/skill/skill');
import PlayerCtrl = require('beamQuest/ctrl/player');

class PlayerSkill extends Skill {
    /**
     * @type {!ctrl.Player} スキル使用者
     * @protected
     */
    user:PlayerCtrl;

    /**
     * スキルを実行する
     */
    fire() {
        // BPを減らす。BPの概念があるのはプレイヤーのみ
        this.user.model.addBp(-this.model.bp);
        super.fire();
    }

}

export = PlayerSkill;