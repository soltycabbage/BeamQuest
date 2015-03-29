import EntityModel = require('beamQuest/model/entity');
import ScheduleTarget = require('beamQuest/scheduleTarget');
import EntityListener = require('beamQuest/listener/entity');
import Buff     = require('beamQuest/buff/buff');
import Control = require('beamQuest/ctrl/ctrl');

/**
 * すべてのmob、playerの基底クラス。
 * HPの増減、ステータス異常、死亡処理など敵味方関係のない共通の処理はここに書く
 * @constructor
 * @param {Object} modelData
 * @extends {bq.ScheduleTarget}
 */
class Entity extends ScheduleTarget implements Control<EntityModel> {
    model:EntityModel;

    /**
     * ctrlをnewしたあとは必ずこれを呼んでmodel(各種ステータスとか)をセットすること
     * @param {EntityModel} model
     * @Override
     */
    setModel(model:EntityModel) {
        this.model = model;

        this.model.on('addHp', _.bind(this.handleAddHp, this));
    }

    /** @protected */
    handleAddHp(amount:number, isCritical:boolean, decorate:string) {
        var hpData = [
            {entity: this.model, hpAmount: amount, isCritical: isCritical, decorate: decorate}
        ];
        EntityListener.getInstance().updateHp(hpData);
        if (this.model.hp <= 0) {
            this.death();
        }
    }

    /**
     * 死亡フラグ
     * @protected
     */
    death() {
        // playerとかmobとかでoverrideする
    }
}

export = Entity;
