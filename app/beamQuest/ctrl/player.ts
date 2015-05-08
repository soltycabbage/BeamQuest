import EntityCtrl = require('beamQuest/ctrl/entity');
import Control = require('beamQuest/ctrl/ctrl');
import UserStore = require('beamQuest/store/userStore');
import EntityListener = require('beamQuest/listener/entity');
import PlayerModel = require('beamQuest/model/player');

declare var logger: any;

// TODO 外にだして
var config = {
    SAVE_INTERVAL: 300
};

class Player extends EntityCtrl implements Control<PlayerModel> {
    model: PlayerModel;

    private updateCount_:number;
    /** HP自動回復の間隔(step) */
    private autoHpHealInterval_:number;
    /** BP自動回復の間隔(step) */
    private autoBpHealInterval_:number;
    /**
     * 1回の自動回復のHP回復量(%)
     * 戦闘中とかは%を小さくしたいね
     */
    private autoHpHealRatio_:number;
    /** 1回の自動回復のBP回復量(%) */
    private autoBpHealRatio_:number;

    constructor() {
        super();
        this.updateCount_ = 0;
        this.autoHpHealInterval_ = 100;
        this.autoBpHealInterval_ = 30;
        this.autoHpHealRatio_ = 10;
        this.autoBpHealRatio_ = 10;
    }

    setModel(model) {
        super.setModel(model);
        this.model.on('addBp', _.bind(this.handleAddBp_, this));
    }

    /**
     * @param {number} amount
     * @param {boolean} isCritical
     */
    private handleAddBp_(amount:number, isCritical:boolean) {
        EntityListener.updateBp({entity: this.model, bpAmount: amount, isCritical: isCritical});
    }

    update() {
        this.updateCount_++;
        if (this.updateCount_ % config.SAVE_INTERVAL === 0) {
            UserStore.save(this);
        }

        // 自動回復(HP)
        if (!this.model.isDeath && this.updateCount_ % this.autoHpHealInterval_ === 0 &&
            this.model.hp < this.model.maxHp) {
            this.model.addHp(Math.ceil(this.model.maxHp / this.autoHpHealRatio_));
        }

        // 自動回復(BP)
        if (!this.model.isDeath && this.updateCount_ % this.autoBpHealInterval_ === 0 &&
            this.model.bp < this.model.maxBp) {
            this.model.addBp(Math.ceil(this.model.maxBp / this.autoBpHealRatio_));
        }

        if (this.updateCount_ >= Number.MAX_VALUE) {
            this.updateCount_ = 0;
        }
    }

    respawn() {
        this.model.isDeath = false;
        if (this.model.hp <= 0) {
            this.model.addHp(this.model.maxHp);
        }
    }
    death() {
        if (!this.model.isDeath) {
            EntityListener.killPlayer(this);
            this.model.isDeath = true;
        }
    }

    /**
     * 経験値を加算する
     * @param {number} exp
     */
    addExp(exp) {
        var lvUpCount = this.getLevelUpCount_(exp, this.model.lv + 1);
        this.model.addExp(exp);
        if (lvUpCount) {
            this.levelUp_(lvUpCount);
        }
    }

    /**
     * 追加される経験値でどのくらいレベルが上がるのかを返す
     * @param {number} exp 新た獲得する経験値
     * @param {number} nextLevel
     * @return {number} レベル上昇値
     */
    private getLevelUpCount_(exp:number, nextLevel:number) {
        var nextLevelExp = this.model.job.Exp[nextLevel];
        if (!nextLevelExp || this.model.exp + exp < nextLevelExp) {
            return 0;
        }
        return 1 + this.getLevelUpCount_(exp, nextLevel + 1);
    }

    /**
     * レベルを上げる
     * @param {number} lvUpCount
     */
    private levelUp_(lvUpCount) {
        this.model.addLevel(lvUpCount);
        logger.info('player levelUp [playerId=' + this.model.id + ', level=' + this.model.lv +']');
        EntityListener.levelUp(this.model);
    }
}

export = Player;
