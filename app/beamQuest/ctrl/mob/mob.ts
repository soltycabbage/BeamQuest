import EntityCtrl = require('beamQuest/ctrl/entity');
import FieldMapCtrl = require('beamQuest/ctrl/fieldMap');
import EntityListener = require('beamQuest/listener/entity');
import ItemListener = require('beamQuest/listener/item');
import distance = require('beamQuest/math/distance');
import DropItemModel = require('beamQuest/model/dropItem');
import PositionModel = require('beamQuest/model/position');
import EntityStore = require('beamQuest/store/entities');
import MapStore = require('beamQuest/store/maps');
import Control = require('beamQuest/ctrl/ctrl');
import MobModel = require('beamQuest/model/mob');
import ScheduleTarget = require('beamQuest/scheduleTarget');

declare var bq: any;

/**
 * すべてのmobの基底クラス
 * 基本的なAIなどはここに書く。
 * プレイヤーとの距離（近距離、中距離、遠距離）によって攻撃パターンが変化する。
 * 特殊なAIを実装したい場合は新たにクラスを作ってこのクラスを継承し、各種メソッドをoverrideすること。
 */
class Mob extends ScheduleTarget implements Control<MobModel> {
    model:MobModel;

    /**
     * 移動速度
     * TODO: このへんはmobの種類によって変えられるようにする
     */
    moveSpeed:number;
    /** 近接攻撃の射程(px) */
    attackShortRange:number;
    /** 中距離攻撃の射程(px) */
    attackMiddleRange:number;
    /** 遠距離攻撃の射程(px)  */
    attackLongRange:number;
    /**
     * ヘイトリスト
     * @type {Array.<Object.<entityId: string, hate: number>>}
     */
    hateList:any[];
    /** trueなら攻撃を受けるまで敵対行動を取らないタイプのmob */
    isPassive:boolean;
    /** 行動中(攻撃モーション中 etc）ならtrue */
    private isActive_:boolean;
    /** 敵対行動を中止して攻撃開始位置に戻っている間true */
    private isCancelAttacking_:boolean;
    /** * 攻撃対象のEntity */
    hateTarget:EntityCtrl;
    /** どのくらいの距離を離れたら敵視を解除するか(px) */
    attackCancelDistance:number;
    /** * 攻撃をキャンセルした時とかに戻る位置 */
    startPos:PositionModel;

    private interval_:any;
    private timeout_:any;

    constructor() {
        super();

        this.scheduleUpdate();

        this.moveSpeed = 3;
        this.attackShortRange = 50;
        this.attackMiddleRange = 200;
        this.attackLongRange = 400;
        this.hateList = [];
        this.isPassive = true;
        this.isActive_ = false;
        this.isCancelAttacking_ = false;
        this.hateTarget = null;
        this.attackCancelDistance = 1000;
        this.startPos = null;
    }

    setModel(model:MobModel) {
        this.model = model;
    }

    update() {
        if (!_.isEmpty(this.hateList)) {
            var targetId = this.hateList[0].entityId;
            var targetEntity = EntityStore.getInstance().getPlayerById(targetId);
            if (targetEntity && targetEntity.model.isDeath) {
                this.hateList.shift();
                if (_.isEmpty(this.hateList) && this.startPos) {
                    // 敵対キャラを殺し尽くしたら元の位置に戻っていく・・・
                    this.isActive_ = false;
                    this.attackCancel();
                }
            } else if (targetEntity) { // ターゲットが同じマップ内にいるなら攻撃を仕掛ける
                this.attackTo(targetEntity);
            }
        }

    }

    /**
     * 指定IDに敵対行動を取る
     * @param {ctrl.Entity} entity
     */
    attackTo(entity:EntityCtrl) {
        if (this.hateTarget !== entity) {
            EntityListener.getInstance().targetTo(this, entity);
        }
        this.hateTarget = entity;
        this.moveTo(this.hateTarget.model.position);
    }

    /**
     * 移動
     * @param {model.Position} targetPos
     * @param {number=} opt_speed intervalの間隔(msec)
     */
    moveTo(targetPos:PositionModel, opt_speed?:number) {
        if (this.isActive_) { // 攻撃動作中の時はmoveTo命令が来ても無視する
            this.interval_ && clearInterval(this.interval_);
            return;
        }

        // ターゲットまでの距離を計算
        var dist = distance.euclidean(this.model.position, targetPos);

        // 攻撃開始地点から一定距離離れたら攻撃を諦めて攻撃開始地点に戻る
        if (this.startPos && !this.isCancelAttacking_) {
            var distanceFromStartPos = distance.euclidean(this.startPos, this.model.position);
            if (distanceFromStartPos > this.attackCancelDistance) {
                this.attackCancel();
                return;
            }
        }

        // 近距離攻撃の射程に入ったら攻撃動作に入る
        if (dist < this.attackShortRange) {
            this.interval_ && clearInterval(this.interval_);
            this.shortRangeAttack();
            return;
        }
        var interval = opt_speed || 300;
        var step = Math.ceil(dist / this.moveSpeed);
        if (step <= 0) { return; }
        var count = 1;
        var v = distance.manhattan(this.model.position, targetPos);
        var vx = Math.ceil(v.x / step);
        var vy = Math.ceil(v.y / step);

        this.model.position.x += vx;
        this.model.position.y += vy;
        this.updatePosition();

        clearInterval(this.interval_);
        this.interval_ = setInterval(() => {
            if (step > count++) {
                this.model.position.x += vx;
                this.model.position.y += vy;
                this.updatePosition();
            } else {
                this.isCancelAttacking_ = false;
                clearInterval(this.interval_);
            }
        }, interval);
    }

    /**
     * 現在の位置情報を更新する
     */
    updatePosition() {
        var entity:any = EntityStore.getInstance().getMobById(this.model.id);
        if (entity) {
            entity.model.position.x = this.model.position.x;
            entity.model.position.y = this.model.position.y;
            EntityListener.getInstance().moveMob(entity);
        }
    }

    /**
     * 近接攻撃をする
     */
    shortRangeAttack() {
        if (!this.isActive_ && this.hateTarget) {
            this.isActive_ = true;
            var srcPos = this.model.position;
            var destPos = this.hateTarget.model.position;
            var range = 100; // TODO: 攻撃の種類によって設定できるように
            var castTime = 1000;
            EntityListener.getInstance().startAttackShortRange(this.model.id, srcPos, destPos, range, castTime);

            this.timeout_ = setTimeout(() => {
                if (this.hateTarget) {
                    // 緊急回避中だったらノーダメやで
                    if (this.hateTarget.model.isDodge) {
                        this.hateTarget.model.addHp(-1);
                        return;
                    }

                    // TODO: 範囲内に対象がいるかどうかチェックする

                    // ダメージテキトー
                    var damage = -Math.floor(this.model.attack / 2 + this.model.attack / 2 * Math.random() -
                        this.hateTarget.model.defence / 4);
                    this.hateTarget.model.addHp(damage);
                }
                this.isActive_ = false;
            }, castTime);
        }
    }

    /**
     * 中距離攻撃をする
     */
    middleRangeAttack() {

    }

    /**
     * 遠距離攻撃をする
     */
    longRangeAttack() {

    }

    /**
     * 敵対行動を中止する
     */
    attackCancel() {
        this.isCancelAttacking_ = true;

        // たまに無敵状態(isCancelがtrue)のままになっちゃうので時間経過でも無敵状態を解除するようにする
        setTimeout(_.bind(function() {
            this.isCancelAttacking_ = false;
        }, this), 30000);

        this.hateList = _.reject(this.hateList, (h) => {
            return h.entityId === this.hateTarget.model.id;
        });

        this.hateTarget = null;
        this.model.addHp(this.model.maxHp);
        if (_.isEmpty(this.hateList) && this.startPos) {
            this.isActive_ = false;
            this.moveTo(this.startPos, 50);
        }
    }

    /** @override */
    beamHit(beamType, shooterId) {
        var shooter = EntityStore.getInstance().getPlayerById(shooterId);
        if (this.isCancelAttacking_ || !shooter) {
            this.model.addHp(0);
            return;
        }

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

        this.applyHate(shooterId, damage);
        this.model.addHp(-damage, isCritical);
    }

    /**
     * 攻撃を与えたユーザのIDをヘイトリストに突っ込む
     * @param {string} entityId
     * @param {number} hate
     */
    applyHate(entityId:string, hate:number) {
        var hateTarget:any = _.find(this.hateList, (h) => h.entityId === entityId);

        if (!hateTarget) {
            this.hateList.push({entityId: entityId, hate: hate});
        } else {
            // ダメージ量がそのままヘイト値になる
            hateTarget.hate += hate;
        }
        // ヘイト値の大きい順にソートしておく
        this.hateList = _.sortBy(this.hateList, (h) => -h.hate);
    }

    /**
     * @override
     */
    death() {
        var map = MapStore.getInstance().getMapById(this.model.mapId);
        var dropItems:DropItemModel[] = this.throwDropItems_(this.chooseDropItems_());
        map.addDropItems(dropItems);

        var data = [];
        dropItems.forEach((dropItem:DropItemModel) => {
            var json = dropItem.toJSON();
            json.mapId = this.model.mapId; // とちゅうで混ぜるのはわかりにくいのでなんとかしたい
            data.push(json);
        });
        ItemListener.getInstance().notify(data);
        EntityListener.getInstance().killMob(this);
        EntityStore.getInstance().removeMob(this);
    }

    /**
     * ドロップするアイテムの抽選をする
     * @return {Array.<string>}
     */
    private chooseDropItems_(): DropItemModel[] {
        var result = [];
        var dropItems:any =  this.model.drop;
        var money = this.model.money;
        // 設定値+10%の範囲で適当に分散
        money += Math.floor(Math.random() * money * 0.1);
        result.push(this.createDropItem_(bq.Types.Items.BEATS, money));
        _.forEach(dropItems, (item:any) => {
            if (Math.floor(Math.random() * item['rate']) === 0) {
                result.push(this.createDropItem_(item.id, 1));
            }
        });

        return result;
    }

    /**
     * アイテムを散らす
     * @param dropItems
     * @returns {DropItemModel[]}
     * @private
     */
    private throwDropItems_(dropItems:DropItemModel[]): DropItemModel[] {
        var pos = this.model.position;
        _.forEach(dropItems, (dropItem:DropItemModel) => {
            var p:any = _.clone(pos);
            // ドロップ位置を散らす
            p.x += Math.random() * 64;
            p.y += Math.random() * 64;
            dropItem.setPosition(p);
        });
        return dropItems;
    }

    /**
     * @param {bq.Types.Items} itemId
     * @param {string} num
     * @return {!model.DropItem}
     */
    private createDropItem_(itemId, num:number): DropItemModel {
        var dropperId = !_.isEmpty(this.hateList) ? this.hateList[0]['entityId'] : null;
        var dropItem = new DropItemModel({
            itemId: itemId,
            num: num,
            dropperId: dropperId,
            droppedAt: new Date().getTime()
        });

        return dropItem;
    }

    /**
     * メモリリークしないよう参照を切っとく
     */
    dispose() {
        delete this.hateList;
        delete this.model;
        this.interval_ && clearInterval(this.interval_);
        this.timeout_ && clearTimeout(this.timeout_);
    }
}

export = Mob;
