import EntityCtrl = require('../ctrl/entity');

/**
 * バフ・デバフの基底クラス
 */
class Buff {
    // 効果時間 (msec
    time: number;
    constructor(public target:EntityCtrl) {
        this.time = 1000;
    }

    /**
     * バフ・デバフを有効にする
     */
    apply():void {
       // override me!
    }
}

export = Buff;