import  Model = require('beamQuest/model/model');

/**
 * Entityが使用するスキルのmodel
 * @extends {model.Model}
 */
class Skill extends Model {
    /** @var スキルID */
    id: string;

    /** @var スキル名 */
    name: string;

    /** @var スキルの説明文 */
    info: string;

    /** @var 消費BP */
    bp: Number;

    /** @var キャストタイム。使用開始してから発動するまでの時間(msec) */
    castTime: Number;

    /** @var リキャストタイム。発動してから再使用可能になるまでの時間(msec) */
    recastTime: Number;

    /** @var 射程距離(px) */
    range: Number

    /** @var 有効半径(px) */
    radius: Number;

    /**
     * @param opt_data
     */
    constructor(opt_data: any) {
        super(opt_data);

        this.id   = this.data.id;
        this.name = this.data.name;
        this.info = this.data.info;
        this.bp = this.data.bp;
        this.castTime = this.data.castTime;
        this.recastTime = this.data.recastTime;
        this.range = this.data.range;
        this.radius = this.data.radius;
    }

    /** @override */
    toJSON() : any{
        var json = super.toJSON();
        json.id = this.id;
        json.name = this.name;
        json.info = this.info;
        json.bp = this.bp;
        json.castTime = this.castTime;
        json.recastTime = this.recastTime;
        json.range = this.range;
        json.radius = this.radius;
        return json;
    }
}

export = Skill;
