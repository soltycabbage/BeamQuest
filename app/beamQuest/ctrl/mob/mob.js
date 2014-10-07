var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EntityCtrl = require('beamQuest/ctrl/entity');
var EntityListener = require('beamQuest/listener/entity');
var ItemListener = require('beamQuest/listener/item');
var distance = require('beamQuest/math/distance');
var DropItemModel = require('beamQuest/model/dropItem');
var EntityStore = require('beamQuest/store/entities');
/**
 * すべてのmobの基底クラス
 * 基本的なAIなどはここに書く。
 * プレイヤーとの距離（近距離、中距離、遠距離）によって攻撃パターンが変化する。
 * 特殊なAIを実装したい場合は新たにクラスを作ってこのクラスを継承し、各種メソッドをoverrideすること。
 */
var Mob = (function (_super) {
    __extends(Mob, _super);
    function Mob() {
        _super.call(this);
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
    Mob.prototype.update = function () {
        if (!_.isEmpty(this.hateList)) {
            var targetId = this.hateList[0].entityId;
            var targetEntity = EntityStore.getInstance().getPlayerById(this.model.position.mapId, targetId);
            if (targetEntity && targetEntity.model.isDeath) {
                this.hateList.shift();
                if (_.isEmpty(this.hateList) && this.startPos) {
                    // 敵対キャラを殺し尽くしたら元の位置に戻っていく・・・
                    this.isActive_ = false;
                    this.attackCancel();
                }
            }
            else if (targetEntity) {
                this.attackTo(targetEntity);
            }
        }
    };
    /**
     * 指定IDに敵対行動を取る
     * @param {ctrl.Entity} entity
     */
    Mob.prototype.attackTo = function (entity) {
        if (this.hateTarget !== entity) {
            EntityListener.getInstance().targetTo(this, entity);
        }
        this.hateTarget = entity;
        this.moveTo(this.hateTarget.model.position);
    };
    /**
     * 移動
     * @param {model.Position} targetPos
     * @param {number=} opt_speed intervalの間隔(msec)
     */
    Mob.prototype.moveTo = function (targetPos, opt_speed) {
        var _this = this;
        if (this.isActive_) {
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
        if (step <= 0) {
            return;
        }
        var count = 1;
        var v = distance.manhattan(this.model.position, targetPos);
        var vx = Math.ceil(v.x / step);
        var vy = Math.ceil(v.y / step);
        this.model.position.x += vx;
        this.model.position.y += vy;
        this.updatePosition();
        clearInterval(this.interval_);
        this.interval_ = setInterval(function () {
            if (step > count++) {
                _this.model.position.x += vx;
                _this.model.position.y += vy;
                _this.updatePosition();
            }
            else {
                _this.isCancelAttacking_ = false;
                clearInterval(_this.interval_);
            }
        }, interval);
    };
    /**
     * 現在の位置情報を更新する
     */
    Mob.prototype.updatePosition = function () {
        var entity = EntityStore.getInstance().getMobById(this.model.position.mapId, this.model.id);
        if (entity) {
            entity.model.position.x = this.model.position.x;
            entity.model.position.y = this.model.position.y;
            EntityListener.getInstance().moveMob(entity);
        }
    };
    /**
     * 近接攻撃をする
     */
    Mob.prototype.shortRangeAttack = function () {
        var _this = this;
        if (!this.isActive_ && this.hateTarget) {
            this.isActive_ = true;
            var srcPos = this.model.position;
            var destPos = this.hateTarget.model.position;
            var range = 100; // TODO: 攻撃の種類によって設定できるように
            var castTime = 1000;
            EntityListener.getInstance().startAttackShortRange(this.model.id, srcPos, destPos, range, castTime);
            this.timeout_ = setTimeout(function () {
                if (_this.hateTarget) {
                    // TODO: 範囲内に対象がいるかどうかチェックする
                    // ダメージテキトー
                    var damage = -Math.floor(_this.model.attack / 2 + _this.model.attack / 2 * Math.random() - _this.hateTarget.model.defence / 4);
                    _this.hateTarget.model.addHp(damage);
                }
                _this.isActive_ = false;
            }, castTime);
        }
    };
    /**
     * 中距離攻撃をする
     */
    Mob.prototype.middleRangeAttack = function () {
    };
    /**
     * 遠距離攻撃をする
     */
    Mob.prototype.longRangeAttack = function () {
    };
    /**
     * 敵対行動を中止する
     */
    Mob.prototype.attackCancel = function () {
        var _this = this;
        this.isCancelAttacking_ = true;
        // たまに無敵状態(isCancelがtrue)のままになっちゃうので時間経過でも無敵状態を解除するようにする
        setTimeout(_.bind(function () {
            this.isCancelAttacking_ = false;
        }, this), 30000);
        this.hateList = _.reject(this.hateList, function (h) {
            return h.entityId === _this.hateTarget.model.id;
        });
        this.hateTarget = null;
        this.model.addHp(this.model.maxHp);
        if (_.isEmpty(this.hateList) && this.startPos) {
            this.isActive_ = false;
            this.moveTo(this.startPos, 50);
        }
    };
    /** @override */
    Mob.prototype.beamHit = function (beamType, shooterId, mapId) {
        var shooter = EntityStore.getInstance().getPlayerById(mapId, shooterId);
        if (this.isCancelAttacking_ || !shooter) {
            this.model.addHp(0);
            return;
        }
        // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
        //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
        var beam = bq.params.Beams[beamType.toUpperCase()];
        // TODO: ダメージ計算(どこかにロジックをまとめたい）
        // いまんとこドラクエ式 (攻撃力/2) - (防御力/4)
        var damage = Math.floor((Math.random() * beam.atk / 2 + beam.atk + shooter.model.attack) / 2 - this.model.defence / 4);
        // TODO: クリティカル計算
        var isCritical = false;
        if (Math.floor(Math.random() * 100) < 10) {
            isCritical = true;
            damage *= 2;
        }
        this.applyHate(shooterId, damage);
        this.model.addHp(-damage, isCritical);
    };
    /**
     * 攻撃を与えたユーザのIDをヘイトリストに突っ込む
     * @param {string} entityId
     * @param {number} hate
     */
    Mob.prototype.applyHate = function (entityId, hate) {
        var hateTarget = _.find(this.hateList, function (h) { return h.entityId === entityId; });
        if (!hateTarget) {
            this.hateList.push({ entityId: entityId, hate: hate });
        }
        else {
            // ダメージ量がそのままヘイト値になる
            hateTarget.hate += hate;
        }
        // ヘイト値の大きい順にソートしておく
        this.hateList = _.sortBy(this.hateList, function (h) { return -h.hate; });
    };
    /**
     * @override
     */
    Mob.prototype.death = function () {
        ItemListener.getInstance().drop(this.chooseDropItems_(), this.model.position);
        EntityListener.getInstance().killMob(this);
        EntityStore.getInstance().removeMob(this);
    };
    /**
     * ドロップするアイテムの抽選をする
     * @return {Array.<string>}
     */
    Mob.prototype.chooseDropItems_ = function () {
        var _this = this;
        var result = [];
        var dropItems = this.model.drop;
        var money = this.model.money;
        // 設定値+10%の範囲で適当に分散
        money += Math.floor(Math.random() * money * 0.1);
        result.push(this.createDropItem_(bq.Types.Items.BEATS, money));
        _.forEach(dropItems, function (item) {
            if (Math.floor(Math.random() * item['rate']) === 0) {
                result.push(_this.createDropItem_(item.id, 1));
            }
        });
        return result;
    };
    /**
     * @param {bq.Types.Items} itemId
     * @param {string} num
     * @return {!model.DropItem}
     */
    Mob.prototype.createDropItem_ = function (itemId, num) {
        var dropperId = !_.isEmpty(this.hateList) ? this.hateList[0]['entityId'] : null;
        var dropItem = new DropItemModel({
            itemId: itemId,
            num: num,
            dropperId: dropperId,
            droppedAt: new Date().getTime()
        });
        return dropItem;
    };
    /**
     * メモリリークしないよう参照を切っとく
     */
    Mob.prototype.dispose = function () {
        delete this.hateList;
        delete this.model;
        this.interval_ && clearInterval(this.interval_);
        this.timeout_ && clearTimeout(this.timeout_);
    };
    return Mob;
})(EntityCtrl);
module.exports = Mob;
//# sourceMappingURL=mob.js.map