var util = require('util'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    userStore = require('beamQuest/store/userStore'),
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
 * @private
 */
Player.prototype.handleAddBp_ = function(amount) {
    entityListener.updateBp({entity: this.model, bpAmount: amount});
};

Player.prototype.update = function() {
    this.updateCount_++;
    if (this.updateCount_ % config.SAVE_INTERVAL === 0) {
        userStore.save(this);
    }

    // 自動回復(HP)
    if (!this.model.isDeath && this.updateCount_ % this.autoHpHealInterval_ === 0 &&
        this.model.hp < this.model.maxHp) {
        this.model.addHp(Math.ceil(this.model.maxHp / this.autoHpHealRatio_));
    }

    // 自動回復(BP)
    if (!this.model.isDeath && this.updateCount_ % this.autoBpHealInterval_ === 0 &&
        this.model.bp < this.model.maxBp) {
        this.model.addBp(Math.ceil(this.model.maxBp / this.autoBpHealRatio_))
    }

    if (this.updateCount_ >= Number.MAX_VALUE) {
        this.updateCount_ = 0;
    }
};

Player.prototype.respawn = function() {
    this.model.isDeath = false;
    this.model.addHp(this.model.maxHp);
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
    this.model.addExp(exp);
    this.tryLevelUp_();
};

/**
 * 現在の経験値を調べて、
 * 次のレベルまでに必要な経験値に達していたらレベルアップする
 * @return {boolean} レベルアップできたらtrue
 * @private
 */
Player.prototype.tryLevelUp_ = function() {
    var nextLevelExp = bq.Params.Exp[this.model.lv + 1];
    if (this.model.exp >= nextLevelExp) {
        this.levelUp();
        return true;
    }
    return false;
};

/**
 * レベルを1上げる
 */
Player.prototype.levelUp = function() {
    this.model.addLevel(1);
    logger.info('player levelUp [playerId=' + this.model.id + ', level=' + this.model.lv +']');
    var chainLevelUp = this.tryLevelUp_(); // もらう経験値次第ではレベルが2以上アップする可能性があるので
    if (!chainLevelUp) {
        entityListener.levelUp(this.model);
    }
};

module.exports = Player;
