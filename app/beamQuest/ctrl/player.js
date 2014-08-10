var util = require('util'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    UserStore = require('beamQuest/store/userStore'),
    entityListener = require('beamQuest/listener/entity');

// TODO 外にだして
var config = {
    SAVE_INTERVAL: 300
};

var Player = function() {
    EntityCtrl.apply(this, arguments);
    this.updateCount_ = 0;

    /**
     * HP自動回復の間隔(step)
     * @type {number}
     * @private
     */
    this.autoHpHealInterval_ = 100;

    /**
     * BP自動回復の間隔(step)
     * @type {number}
     * @private
     */
    this.autoBpHealInterval_ = 30;

    /**
     * 1回の自動回復のHP回復量(%)
     * 戦闘中とかは%を小さくしたいね
     * @type {Number}
     * @private
     */
    this.autoHpHealRatio_ = 10;

    /**
     * 1回の自動回復のBP回復量(%)
     * @type {Number}
     * @private
     */
    this.autoBpHealRatio_ = 10;
};
util.inherits(Player, EntityCtrl);

/** @override */
Player.prototype.setModel = function(model) {
    Player.super_.prototype.setModel.call(this, model);
    this.model.on('addBp', _.bind(this.handleAddBp_, this));
};

/**
 * @param {number} amount
 * @param {boolean} isCritical
 * @private
 */
Player.prototype.handleAddBp_ = function(amount, isCritical) {
    entityListener.updateBp({entity: this.model, bpAmount: amount, isCritical: isCritical});
};

Player.prototype.update = function() {
    this.updateCount_++;
    if (this.updateCount_ % config.SAVE_INTERVAL === 0) {
        UserStore.getInstance().save(this);
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
};

Player.prototype.respawn = function() {
    this.model.isDeath = false;
    if (this.model.hp <= 0) {
        this.model.addHp(this.model.maxHp);
    }
};

/** @override */
Player.prototype.death = function() {
    if (!this.model.isDeath) {
        entityListener.killPlayer(this);
        this.model.isDeath = true;
    }
};

/**
 * 経験値を加算する
 * @param {number} exp
 */
Player.prototype.addExp = function(exp) {
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
 * @private
 */
Player.prototype.getLevelUpCount_ = function(exp, nextLevel) {
    var nextLevelExp = this.model.job.Exp[nextLevel];
    if (!nextLevelExp || this.model.exp + exp < nextLevelExp) {
        return 0;
    }
    return 1 + this.getLevelUpCount_(exp, nextLevel + 1);
};

/**
 * レベルを上げる
 * @param {number} lvUpCount
 * @private
 */
Player.prototype.levelUp_ = function(lvUpCount) {
    this.model.addLevel(lvUpCount);
    logger.info('player levelUp [playerId=' + this.model.id + ', level=' + this.model.lv +']');
    entityListener.levelUp(this.model);
};

module.exports = Player;
