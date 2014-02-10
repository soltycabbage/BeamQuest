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
     * 自動回復の間隔
     * @type {number}
     * @private
     */
    this.autoHealInterval_ = 100;

    /**
     * 1回の自動回復の回復量(%)
     * 戦闘中とかは%を小さくしたいね
     * @type {Number}
     * @private
     */
    this.autoHealRatio_ = 10;
};
util.inherits(Player, EntityCtrl);

Player.prototype.update = function() {
    this.updateCount_++;
    if (this.updateCount_ % config.SAVE_INTERVAL === 0) {
        userStore.save(this);
    }

    // 自動回復
    if (!this.model.isDeath && this.updateCount_ % this.autoHealInterval_ === 0 &&
        this.model.hp < this.model.maxHp) {
        var amount = this.model.maxHp / this.autoHealRatio_;
        this.model.addHp(amount);
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
    this.model.exp += exp;
    this.checkExp_();
};

/**
 * 現在の経験値を調べる。
 * 次のレベルまでに必要な経験値に達していたらレベルアップする
 * @private
 */
Player.prototype.checkExp_ = function() {
    var nextLevelExp = bq.Params.Exp[this.model.lv + 1];
    if (this.model.exp >= nextLevelExp) {
        this.levelUp();
    }
};

/**
 * レベルを1上げる
 */
Player.prototype.levelUp = function() {
    this.model.lv++;
    // TODO: レベルアップの処理を書く
    console.log('Level' + this.model.lv);
    this.checkExp_();
};

module.exports = Player;
