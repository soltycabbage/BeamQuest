var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Entity = require('beamQuest/model/entity');
var BaseStatusModel = require('beamQuest/model/baseStatus');

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(opt_data) {
        _super.call(this, opt_data);

        this.type = bq.Types.EntityType.PLAYER;
        this.baseStatus = new BaseStatusModel(this.data.status);
        this.maxBp = this.data.maxBp || Player.DEFAULT_MAX_BP;
        this.bp = this.data.bp || this.maxBp;
        this.exp = this.data.exp || 0;
        this.lv = this.data.lv || 1;
        this.job = this.data.job || bq.params.Jobs.NOVICE;
        this.prevLvExp = this.job.Exp[this.lv];
        this.nextLvExp = this.job.Exp[this.lv + 1];
        this.isDeath = !!this.data.isDeath;
        this.beam = bq.params.Beams.NORMAL1;
        this.hotbarItems = this.data.hotbarItems || this.skills;
        this.socket = this.data.socket || null;

        this.updateStatus();
    }
    /**
    * baseStatus (STR, INT, CONなどなど）や装備品、バフ、デバフからHP, BP, 攻撃力などなどを決定する
    */
    Player.prototype.updateStatus = function () {
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
    * @param {boolean=] opt_isCritical
    */
    Player.prototype.addBp = function (amount, opt_isCritical) {
        this.bp = Math.max(0, Math.min(this.maxBp, this.bp + amount));
        this.emit('addBp', amount, !!opt_isCritical);
    };

    /**
    * @param {number} exp
    */
    Player.prototype.addExp = function (exp) {
        this.exp += exp;
    };

    Player.prototype.addLevel = function (lv) {
        this.lv += lv;

        for (var i = 0; i < lv; i++) {
            // TODO: ばらつきをもたせる
            this.baseStatus.con++;
            this.baseStatus.int++;
            this.baseStatus.str++;
            this.baseStatus.def++;
        }

        this.updateStatus();
        this.updatePrevNextLvExp();
    };

    /**
    * 前/次レベルまでに必要な経験値を更新する
    */
    Player.prototype.updatePrevNextLvExp = function () {
        this.prevLvExp = this.job.Exp[this.lv];
        this.nextLvExp = this.job.Exp[this.lv + 1];
    };

    Player.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.status = this.baseStatus.toJSON();
        json.maxBp = this.maxBp;
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
    Player.DEFAULT_MAX_BP = 10;
    return Player;
})(Entity);

module.exports = Player;
//# sourceMappingURL=player.js.map
