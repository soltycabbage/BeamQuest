import Buff = require('beamQuest/buff/buff');
import EntityCtrl = require('beamQuest/ctrl/entity');

/**
 * 対象に毒の継続ダメージを与える
 */
class Poison extends Buff {
    // 毒の間隔
    intervalTime: number;
    // フライテキストの装飾
    decorateFormat: string;
    // ダメージ量
    damage: number;

    constructor(target:EntityCtrl) {
        super(target)

        this.time = 5000;
        this.intervalTime = 2500;
        this.decorateFormat = 'どく:${value}${color:178,108,255}';
        this.damage = -10;
    }

    /** @override */
    apply():void {
        var interval = setInterval(() => {
            if (this.target) {
                var damage = this.damage + Math.floor(this.damage * Math.random());
                this.target.model && this.target.model.addHp(damage, false, this.decorateFormat);
            }
        }, this.intervalTime);

        setTimeout(() =>{
            if (this.target) {
                this.target.model && this.target.model.removeDebuff(this);
            }
            clearInterval(interval);
        }, this.time);
    }
}

export = Poison;