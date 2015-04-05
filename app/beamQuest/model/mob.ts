import Entity = require('beamQuest/model/entity');

declare var bq: any;

class Mob extends Entity {
    static DEFAULT_EXP:number = 1;

    /** 獲得経験値的な */
    exp: number;
    /** 移動速度 */
    moveSpeed: number;
    /** trueなら攻撃を受けるまで敵対行動を取らないタイプのmob  */
    isPassive: boolean;
    /** ドロップするアイテムのリスト */
    drop: Object[];
    /** ドロップするビーツの量 */
    money: number;
    /** 敵の場合は最大HPを設定値から取得してくる */
    maxHp: number;
    /** クライアントで表示する敵画像の番号 */
    mobImageId: string;

    constructor(opt_dat) {
        super(opt_dat);

        this.type = bq.Types.EntityType.MOB;
        this.exp = this.data.exp || Mob.DEFAULT_EXP;
        this.moveSpeed = 5;
        this.isPassive = true;
        this.drop = this.data.drop || [];
        this.money = this.data.money || 0;
        this.maxHp = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;
    }

    setMobImageId(id:string) {
        this.mobImageId = id;
    }

    toJSON() {
        var json = super.toJSON();
        json.exp = this.exp;
        json.mobImageId = this.mobImageId;
        return json;
    }
}

export = Mob;
