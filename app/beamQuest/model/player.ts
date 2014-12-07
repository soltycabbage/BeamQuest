import Entity = require('beamQuest/model/entity');
import BaseStatusModel = require('beamQuest/model/baseStatus');

declare var bq: any;

class Player extends Entity {
    static DEFAULT_MAX_BP:number = 10;

    baseStatus: BaseStatusModel;
    maxBp: number;
    bp: number;

    /**
     * 総獲得経験値
     * TODO: ジョブごとに経験値を管理する
     */
    exp: number;
    /**
     * レベル
     * TODO: ジョブごとにレベルを管理する
     */
    lv: number;
    /** @type {bq.params.Jobs.NOVICE} */
    job: any;
    /** 前回のレベルアップ時に必要だった経験値数 */
    prevLvExp: number;
    /**
     * 次のレベルまでに必要な経験値
     */
    nextLvExp: number;
    isDeath: boolean;
    /** @type {Beam} */
    beam: any;
    /**
     * ホットバーに登録されているitem一覧
     * itemはユーザが実行可能なもの（スキル、アイテムなど）が対象となる
     * @type {Array.<model.Skill|model.Item>}
     */
    hotbarItems: any[];
    /** @type {Socket} */
    socket: any;

    constructor(opt_data) {
        super(opt_data);

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
     updateStatus() {
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
    }

    /**
     * @param {number} amount
     * @param {boolean=] opt_isCritical
    */
    addBp(amount:number, opt_isCritical?: boolean): void {
        this.bp = Math.max(0, Math.min(this.maxBp, this.bp + amount));
        this.emit('addBp', amount, !!opt_isCritical);
    }

    /**
     * @param {number} exp
     */
    addExp(exp:number): void {
        this.exp += exp;
    }

    addLevel(lv:number): void {
        this.lv += lv;

        for (var i:number = 0;i < lv;i++) {
            // TODO: ばらつきをもたせる
            this.baseStatus.con++;
            this.baseStatus.int++;
            this.baseStatus.str++;
            this.baseStatus.def++;
        }

        this.updateStatus();
        this.updatePrevNextLvExp();
    }

    /**
     * 前/次レベルまでに必要な経験値を更新する
     */
    private updatePrevNextLvExp(): void {
        this.prevLvExp = this.job.Exp[this.lv];
        this.nextLvExp = this.job.Exp[this.lv + 1];
    }

    toJSON(): any {
        var json = super.toJSON();
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
    }
}

export = Player;
