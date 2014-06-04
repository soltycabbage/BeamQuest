var util = require('util'),
    Entity = require('beamQuest/model/entity'),
    BaseStatusModel = require('beamQuest/model/baseStatus');

/**
 * @constructor
 * @extends {model.Entity}
 */
var Player = function(opt_data) {
    Entity.apply(this, arguments);

    /** @type {model.BaseStatus} */
    this.baseStatus = new BaseStatusModel(this.data.status);

    /** @type {number} */
    this.maxBp = this.data.maxBp || Player.DEFAULT_MAX_BP;

    /** @type {number} */
    this.bp = this.data.bp || this.maxBp;

    /**
     * 総獲得経験値
     * TODO: ジョブごとに経験値を管理する
     * @type {number}
     */
    this.exp = this.data.exp || 0;

    /**
     * レベル
     * TODO: ジョブごとにレベルを管理する
     * @type {number}
     */
    this.lv = this.data.lv || 1;
    
    /** @type {bq.params.Jobs.NOVICE} */
    this.job = this.data.job || bq.params.Jobs.NOVICE;

    /**
     * 前回のレベルアップ時に必要だった経験値数
     * @type {number}
     */
    this.prevLvExp = this.job.Exp[this.lv];

    /**
     * 次のレベルまでに必要な経験値
     * @type {number}
     */
    this.nextLvExp = this.job.Exp[this.lv + 1];

    /** @type {boolean} */
    this.isDeath = !!this.data.isDeath;

    /** @type {Beam} */
    this.beam = bq.params.Beams.NORMAL1;

    /**
     * ホットバーに登録されているitem一覧
     * @type {Array.<model.Skill|model.Item>}
     */
    this.hotbarItems = this.data.hotbarItems || this.skills;

    /** @type {Socket} */
    this.socket = this.data.socket || null;

    this.updateStatus();
};
util.inherits(Player, Entity);

Player.DEFAULT_MAX_BP = 10;

/**
 * baseStatus (STR, INT, CONなどなど）や装備品、バフ、デバフからHP, BP, 攻撃力などなどを決定する
 */
Player.prototype.updateStatus = function() {
    // TODO: 装備品によるステータス更新
    // TODO: バフ、デバフによるステータス更新

    // 成長曲線
    // @ggrks ゴンペルツ曲線
    var b = 0.006;
    var c = 0.09;
    var growthRate = 1 + 2 * Math.pow(b, Math.pow(Math.E, (-c * this.lv)));

    this.maxHp = Math.ceil(Entity.DEFAULT_MAX_HP + this.baseStatus.con * this.job.BASE_STATUS_RATE.CON * growthRate);
    this.maxBp = Math.ceil(Player.DEFAULT_MAX_BP + this.baseStatus.int * this.job.BASE_STATUS_RATE.INT * growthRate);
    this.attack = Math.ceil(this.baseStatus.str * this.job.BASE_STATUS_RATE.STR * growthRate);
    this.defence = Math.ceil(this.baseStatus.def * this.job.BASE_STATUS_RATE.DEF * growthRate);
    // TODO: ほかのステータス
};

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

    for (var i = 0;i < lv;i++) {
        // TODO: ばらつきをもたせる
        this.baseStatus.con++;
        this.baseStatus.int++;
        this.baseStatus.str++;
        this.baseStatus.def++;
    }

    this.updateStatus();
    this.updatePrevNextLvExp_();
};

/**
 * 前/次レベルまでに必要な経験値を更新する
 * @private
 */
Player.prototype.updatePrevNextLvExp_ = function() {
    this.prevLvExp = this.job.Exp[this.lv];
    this.nextLvExp = this.job.Exp[this.lv + 1];
};


/** @override */
Player.prototype.toJSON = function() {
    var json = Player.super_.prototype.toJSON.apply(this);
    json.status = this.baseStatus.toJSON();
    json.maxBp =  this.maxBp;
    json.bp = this.bp;
    json.exp = this.exp;
    json.prevLvExp = this.prevLvExp;
    json.nextLvExp = this.nextLvExp;
    json.lv = this.lv;
    json.isDeath = this.isDeath;
    json.beam = this.beam;
    json.hotbarItems = this.toArrayJSON(this.hotbarItems);
    return json;
};

module.exports = Player;
