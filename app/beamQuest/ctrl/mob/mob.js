var util = require('util'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    entityStore = require('beamQuest/store/entities'),
    entityListener = require('beamQuest/listener/entity'),
    itemListener = require('beamQuest/listener/item'),
    distance = require('beamQuest/math/euclideanDistance'),
    manhattanDistance = require('beamQuest/math/manhattanDistance'),
    DropItemModel = require('beamQuest/model/dropItem');

/**
 * すべてのmobの基底クラス
 * 基本的なAIなどはここに書く。
 * プレイヤーとの距離（近距離、中距離、遠距離）によって攻撃パターンが変化する。
 * 特殊なAIを実装したい場合は新たにクラスを作ってこのクラスを継承し、各種メソッドをoverrideすること。
 * @constructor
 * @extends {bq.ScheduleTarget}
 */
var Mob = function() {
    EntityCtrl.apply(this, arguments);
    this.scheduleUpdate();

    /**
     * 移動速度
     * TODO: このへんはmobの種類によって変えられるようにする
     * @type {number}
     */
    this.moveSpeed = 3;

    /**
     * 近接攻撃の射程(px)
     * @type {Number}
     */
    this.attackShortRange = 50;

    /**
     * 中距離攻撃の射程(px)
     * @type {Number}
     */
    this.attackMiddleRange = 200;

    /**
     * 遠距離攻撃の射程(px)
     * @type {Number}
     */
    this.attackLongRange = 400;

    /**
     * ヘイトリスト
     * @type {Array.<Object.<entityId: string, hate: number>>}
     */
    this.hateList = [];

    /**
     * trueなら攻撃を受けるまで敵対行動を取らないタイプのmob
     * @type {Boolean}
     */
    this.isPassive = true;

    /**
     * 行動中(攻撃モーション中 etc）ならtrue
     * @type {Boolean}
     * @private
     */
    this.isActive_ = false;

    /**
     * 敵対行動を中止して攻撃開始位置に戻っている間true
     * @type {Boolean}
     * @private
     */
    this.isCancelAttacking_ = false;

    /**
     * 攻撃対象のEntity
     * @type {ctrl.Entity}
     */
    this.hateTarget = null;

    /**
     * どのくらいの距離を離れたら敵視を解除するか(px)
     * @type {Number}
     */
    this.attackCancelDistance = 1000;

    /**
     * 攻撃をキャンセルした時とかに戻る位置
     * @type {model.Position}
     */
    this.startPos = null;

    entityStore = require('beamQuest/store/entities');
};
util.inherits(Mob, EntityCtrl);

/** @override */
Mob.prototype.update = function() {
    if (!_.isEmpty(this.hateList)) {
        var targetId = this.hateList[0].entityId;
        var targetEntity = entityStore.getPlayerById(this.model.position.mapId, targetId);
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
};

/**
 * 指定IDに敵対行動を取る
 * @param {ctrl.Entity} entity
 */
Mob.prototype.attackTo = function(entity) {
    if (this.hateTarget !== entity) {
        entityListener.targetTo(this, entity);
    }
    this.hateTarget = entity;
    this.moveTo(this.hateTarget.model.position);

};

/**
 * 移動
 * @param {model.Position} targetPos
 * @param {number=} opt_speed intervalの間隔(msec)
 */
Mob.prototype.moveTo = function(targetPos, opt_speed) {
    if (this.isActive_) { // 攻撃動作中の時はmoveTo命令が来ても無視する
        this.interval_ && clearInterval(this.interval_);
        return;
    }

    // ターゲットまでの距離を計算
    var dist = distance(this.model.position, targetPos);

    // 攻撃開始地点から一定距離離れたら攻撃を諦めて攻撃開始地点に戻る
    if (this.startPos && !this.isCancelAttacking_) {
        var distanceFromStartPos = distance(this.startPos, this.model.position);
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
    var v = manhattanDistance(this.model.position, targetPos);
    var vx = Math.ceil(v.x / step);
    var vy = Math.ceil(v.y / step);

    this.model.position.x += vx;
    this.model.position.y += vy;
    this.updatePosition();

    clearInterval(this.interval_);
    this.interval_ = setInterval(function(){
        if (step > count++) {
            this.model.position.x += vx;
            this.model.position.y += vy;
            this.updatePosition();
        } else {
            this.isCancelAttacking_ = false;
            clearInterval(this.interval_);
        }
    }.bind(this), interval);
};

/**
 * 現在の位置情報を更新する
 */
Mob.prototype.updatePosition = function() {
    var entity = entityStore.getMobById(this.model.position.mapId, this.model.id);
    if (entity) {
        entity.model.position.x = this.model.position.x;
        entity.model.position.y = this.model.position.y;
        entityListener.moveMob(entity);
    }
};

/**
 * 近接攻撃をする
 */
Mob.prototype.shortRangeAttack = function() {
    if (!this.isActive_ && this.hateTarget) {
        this.isActive_ = true;
        var srcPos = this.model.position;
        var destPos = this.hateTarget.model.position;
        var range = 100; // TODO: 攻撃の種類によって設定できるように
        var castTime = 1000;
        entityListener.startAttackShortRange(this.model.id, srcPos, destPos, range, castTime);

        this.timeout_ = setTimeout(function() {
            if (this.hateTarget) {
                // TODO: 範囲内に対象がいるかどうかチェックする

                // ダメージテキトー
                var damage = -Math.floor(this.model.attack / 2 + this.model.attack / 2 * Math.random() -
                    this.hateTarget.model.defence / 4);
                this.hateTarget.model.addHp(damage);
            }
            this.isActive_ = false;
        }.bind(this), castTime);
    }
};

/**
 * 中距離攻撃をする
 */
Mob.prototype.middleRangeAttack = function() {

};

/**
 * 遠距離攻撃をする
 */
Mob.prototype.longRangeAttack = function() {

};

/**
 * 敵対行動を中止する
 */
Mob.prototype.attackCancel = function() {
    this.isCancelAttacking_ = true;

    // たまに無敵状態(isCancelがtrue)のままになっちゃうので時間経過でも無敵状態を解除するようにする
    setTimeout(_.bind(function() {
        this.isCancelAttacking_ = false;
    }, this), 30000);
    
    this.hateList = _.reject(this.hateList, function(h) {
        return h.entityId === this.hateTarget.model.id;
    }.bind(this));

    this.hateTarget = null;
    this.model.addHp(this.model.maxHp);
    if (_.isEmpty(this.hateList) && this.startPos) {
        this.isActive_ = false;
        this.moveTo(this.startPos, 50);
    }
};

/** @override */
Mob.prototype.beamHit = function(beamType, shooterId, mapId) {
    var shooter = entityStore.getPlayerById(mapId, shooterId);
    if (this.isCancelAttacking_ || !shooter) {
        return { hpAmount: 0 };
    }

    // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
    //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
    var beam = bq.params.Beams[beamType.toUpperCase()];

    // TODO: ダメージ計算
    // いまんとこドラクエ式 (攻撃力/2) - (防御力/4)
    var damage = Math.floor((Math.random() * beam.atk / 2 + beam.atk + shooter.model.attack) / 2 -
        this.model.defence / 4);

    // 攻撃を与えたユーザのIDをヘイトリストに突っ込む
    var hateTarget = _.find(this.hateList, function(h) {
        return h.entityId === shooterId;
    });

    if (!hateTarget) {
        this.hateList.push({entityId: shooterId, hate: damage});
    } else {
        // ダメージ量がそのままヘイト値になる
        hateTarget.hate += damage;
    }

    // ヘイト値の大きい順にソートしておく
    this.hateList = _.sortBy(this.hateList, function(h) {return -h.hate;});
    this.model.addHp(-damage);
    return {hpAmount: -damage};
};

/**
 * @override
 */
Mob.prototype.death = function() {
    itemListener.drop(this.chooseDropItems_(), this.model.position);
    entityListener.killMob(this);
    entityStore.removeMob(this);
};

/**
 * ドロップするアイテムの抽選をする
 * @return {Array.<string>}
 * @private
 */
Mob.prototype.chooseDropItems_ = function() {
    var result = [];
    var dropItems =  this.model.drop;
    var money = this.model.money;
    // 設定値+10%の範囲で適当に分散
    money += Math.floor(Math.random() * money * 0.1);
    result.push(this.createDropItem_(bq.Types.Items.BEATS, money));
    _.forEach(dropItems, function(item) {
        if (Math.floor(Math.random() * item['rate']) === 0) {
            result.push(this.createDropItem_(item.id, 1));
        }
    }.bind(this));

    return result;
};

/**
 * @param {bq.Types.Items} itemId
 * @param {string} num
 * @return {!model.DropItem}
 * @private
 */
Mob.prototype.createDropItem_ = function(itemId, num) {
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
Mob.prototype.dispose = function() {
    delete this.hateList;
    delete this.model;
    this.interval_ && clearInterval(this.interval_);
    this.timeout_ && clearTimeout(this.timeout_);
};

module.exports = Mob;
