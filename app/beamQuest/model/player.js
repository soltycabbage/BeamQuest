var util = require('util'),
    Entity = require('beamQuest/model/entity');

/**
 * @constructor
 * @extends {model.Entity}
 */
var Player = function(opt_data) {
    Entity.apply(this, arguments);

    /** @type {number} */
    this.maxBp = this.data.maxBp || Player.DEFAULT_MAX_BP;

    /** @type {number} */
    this.bp = this.data.bp || this.maxBp;

    /**
     * 総獲得経験値
     * @type {number}
     */
    this.exp = this.data.exp || 0;

    /** @type {number} */
    this.lv = this.data.lv || 1;

    /**
     * 前回のレベルアップ時に必要だった経験値数
     * @type {number}
     */
    this.prevExp = bq.Params.Exp[this.lv];

    /**
     * 次のレベルまでに必要な経験値
     * @type {number}
     */
    this.nextExp = bq.Params.Exp[this.lv + 1];

    /** @type {boolean} */
    this.isDeath = !!this.data.isDeath;

    /** @type {Socket} */
    this.socket = this.data.socket || null;
};
util.inherits(Player, Entity);

Player.DEFAULT_MAX_BP = 10;

/**
 * @param {number} amount
 */
Player.prototype.addBp = function(amount) {
    this.bp = Math.max(0, Math.min(this.maxBp, this.bp + amount));
    this.emit('addBp', amount);
};

/**
 * @param {number} exp
 */
Player.prototype.addExp = function(exp) {
    this.exp += exp;
};

/**
 * @param {number} lv
 */
Player.prototype.addLevel = function(lv) {
    this.lv += lv;
    this.updatePrevNextExp_();
};

/**
 * 前/次レベルまでに必要な経験値を更新する
 * @private
 */
Player.prototype.updatePrevNextExp_ = function() {
    this.prevExp = bq.Params.Exp[this.lv];
    this.nextExp = bq.Params.Exp[this.lv + 1];
};


/** @override */
Player.prototype.toJSON = function() {
    var json = Player.super_.prototype.toJSON.apply(this);
    json.maxBp =  this.maxBp;
    json.bp = this.bp;
    json.exp = this.exp;
    json.prevExp = this.prevExp;
    json.nextExp = this.nextExp;
    json.lv = this.lv;
    json.isDeath = this.isDeath;
    return json;
};

module.exports = Player;