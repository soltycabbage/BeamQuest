import EntityModel = require('beamQuest/model/entity');
import ScheduleTarget = require('beamQuest/scheduleTarget');
import EntityListener = require('beamQuest/listener/entity');
import EntityStore = require('beamQuest/store/entities');
import Buff     = require('beamQuest/buff/buff');
import Control = require('beamQuest/ctrl/ctrl');

declare var bq: any;

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

    /**
     *
     * @param amount 効果量
     * @param type ダメージの種類 例) normal, poison
     * @param isCritical クリティカルヒットの場合TRUE
     * @param decorate 装飾付きフライテキスト。
     *                 例) "どく:${value}${color:255,255,0}"
     *                　placeholder一覧:
     *                      ${value} => 効果量の数値が入る
     *                      ${color:nnn,nnn,nnn} => フォントの色（RGB指定）
     *
     * @protected
     */
    handleAddHp(amount:number, type:string, isCritical:boolean, decorate:string) {
        var hpData = [
            {entity: this.model, hpAmount: amount, type: type, isCritical: isCritical, decorate: decorate}
        ];
        EntityListener.updateHp(hpData);
        if (this.model.hp <= 0) {
            this.death();
        }
    }

    beamHit(beamType:string, shooterId: string):number {
        var shooter = EntityStore.getPlayerById(shooterId);
        // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
        //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
        var beam = bq.params.Beams[beamType.toUpperCase()];

        // TODO: ダメージ計算(どこかにロジックをまとめたい）
        // いまんとこドラクエ式 (攻撃力/2) - (防御力/4)
        var damage = Math.floor((Math.random() * beam.atk / 2 + beam.atk + shooter.model.attack) / 2 -
        this.model.defence / 4);

        // TODO: クリティカル計算
        var isCritical = false;
        if (Math.floor(Math.random() * 100) < 10) {
            isCritical = true;
            damage *= 2;
        }

        this.model.addHp(-damage, isCritical);
        return damage;
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
