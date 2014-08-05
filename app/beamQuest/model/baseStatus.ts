/// <reference path="model.ts" />

import Model = require('beamQuest/model/model');

/**
 * Entityの基本ステータス
 */
class BaseStatus extends Model {
    /**
     * 体力
     * HPが上がる
     */
    con: Number;

    /**
     * 知力
     * BPが上がる
     */
    int: Number;

    /**
     * 筋力
     * 攻撃力があがる。この世界では筋力の強さがビームの強さになる、というテイで
     */
    str: Number;

    /**
     * 体幹
     * 防御力が上がる
     */
    def: Number;

    /**
     * センス
     */
    sns: Number;

    /**
     * 運
     * クリティカルヒットとか。たまに経験値もクリティカルヒットする
     */
    luk: Number;

    constructor(opt_data: any) {
        super(opt_data);

        this.con = this.data.con || 1;
        this.int = this.data.int || 1;
        this.str = this.data.str || 1;
        this.def = this.data.def || 1;
        this.sns = this.data.sns || 1;
        this.luk = this.data.luk || 1;
    }

    toJSON(): any {
        var json = super.toJSON();
        json.con = this.con;
        json.int = this.int;
        json.str = this.str;
        json.def = this.def;
        json.sns = this.sns;
        json.luk = this.luk;
        return json;
    }
}

export = BaseStatus;
