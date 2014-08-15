var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EntityCtrl = require('beamQuest/ctrl/entity');
var UserStore = require('beamQuest/store/userStore');
var EntityListener = require('beamQuest/listener/entity');

// TODO 外にだして
var config = {
    SAVE_INTERVAL: 300
};

var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.updateCount_ = 0;
        this.autoHpHealInterval_ = 100;
        this.autoBpHealInterval_ = 30;
        this.autoHpHealRatio_ = 10;
        this.autoBpHealRatio_ = 10;
    }
    Player.prototype.setModel = function (model) {
        _super.prototype.setModel.call(this, model);
        this.model.on('addBp', this.handleAddBp_);
    };

    /**
    * @param {number} amount
    * @param {boolean} isCritical
    */
    Player.prototype.handleAddBp_ = function (amount, isCritical) {
        EntityListener.getInstance().updateBp({ entity: this.model, bpAmount: amount, isCritical: isCritical });
    };

    Player.prototype.update = function () {
        this.updateCount_++;
        if (this.updateCount_ % config.SAVE_INTERVAL === 0) {
            UserStore.getInstance().save(this);
        }

        // 自動回復(HP)
        if (!this.model.isDeath && this.updateCount_ % this.autoHpHealInterval_ === 0 && this.model.hp < this.model.maxHp) {
            this.model.addHp(Math.ceil(this.model.maxHp / this.autoHpHealRatio_));
        }

        // 自動回復(BP)
        if (!this.model.isDeath && this.updateCount_ % this.autoBpHealInterval_ === 0 && this.model.bp < this.model.maxBp) {
            this.model.addBp(Math.ceil(this.model.maxBp / this.autoBpHealRatio_));
        }

        if (this.updateCount_ >= Number.MAX_VALUE) {
            this.updateCount_ = 0;
        }
    };

    Player.prototype.respawn = function () {
        this.model.isDeath = false;
        if (this.model.hp <= 0) {
            this.model.addHp(this.model.maxHp);
        }
    };
    Player.prototype.death = function () {
        if (!this.model.isDeath) {
            EntityListener.getInstance().killPlayer(this);
            this.model.isDeath = true;
        }
    };

    /**
    * 経験値を加算する
    * @param {number} exp
    */
    Player.prototype.addExp = function (exp) {
        var lvUpCount = this.getLevelUpCount_(exp, this.model.lv + 1);
        this.model.addExp(exp);
        if (lvUpCount) {
            this.levelUp_(lvUpCount);
        }
    };

    /**
    * 追加される経験値でどのくらいレベルが上がるのかを返す
    * @param {number} exp 新た獲得する経験値
    * @param {number} nextLevel
    * @return {number} レベル上昇値
    */
    Player.prototype.getLevelUpCount_ = function (exp, nextLevel) {
        var nextLevelExp = this.model.job.Exp[nextLevel];
        if (!nextLevelExp || this.model.exp + exp < nextLevelExp) {
            return 0;
        }
        return 1 + this.getLevelUpCount_(exp, nextLevel + 1);
    };

    /**
    * レベルを上げる
    * @param {number} lvUpCount
    */
    Player.prototype.levelUp_ = function (lvUpCount) {
        this.model.addLevel(lvUpCount);
        logger.info('player levelUp [playerId=' + this.model.id + ', level=' + this.model.lv + ']');
        EntityListener.getInstance().levelUp(this.model);
    };
    return Player;
})(EntityCtrl);

module.exports = Player;
//# sourceMappingURL=player.js.map
