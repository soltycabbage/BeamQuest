var util = require('util'),
    Entity = require('beamQuest/model/entity'),
    entityStore = require('beamQuest/store/entities'),
    entityListener = require('beamQuest/listener/entity'),
    MobModel = require('beamQuest/model/mob'),
    ScheduleTarget = require('beamQuest/scheduleTarget');

/**
 * @constructor
 * @param {Object} modelData
 * @extends {bq.ScheduleTarget}
 */
var Mob = function(modelData) {
    ScheduleTarget.apply(this, arguments);
    this.scheduleUpdate();

    /**
     * @type {model.Mob}
     */
    this.model = new MobModel(modelData);

    /**
     * 移動速度
     * @type {number}
     */
    this.moveSpeed = 5;

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
     * 攻撃対象のEntity
     * @type {model.Entity}
     */
    this.hateTarget = null;

    /**
     * どのくらいの距離を離れたら敵視を解除するか(px)
     * @type {Number}
     */
    this.attackCancelDistance = 500;
};
util.inherits(Mob, ScheduleTarget);

Mob.DEFAULT_EXP = 1;

/** @override */
Mob.prototype.update = function() {
    if (!_.isEmpty(this.hateList)) {
        var targetId = this.hateList[0].entityId;
        var targetEntity = entityStore.getPlayerById(this.model.position.mapId, targetId);
        if (targetEntity) { // ターゲットが同じマップ内にいるなら攻撃を仕掛ける
            this.attackTo(targetEntity);
        }
    }
};

/**
 * 指定IDに敵対行動を取る
 * @param {model.Entity} entity
 */
Mob.prototype.attackTo = function(entity) {
    this.hateTarget = entity;
    this.moveTo(this.hateTarget.position)
    // io.sockets.emit('notify:entity:mob:attackTo', {mob: this.toJSON(), target: entityId});
};

/**
 * 移動
 * @param {model.Position} targetPos
 */
Mob.prototype.moveTo = function(targetPos) {
    var v = {x: targetPos.x - this.model.position.x, y: targetPos.y - this.model.position.y};
    var distance = Math.sqrt(Math.pow(v.x,2) + Math.pow(v.y,2));

    // 一定距離離れたら攻撃を諦める
    if (distance > this.attackCancelDistance) {
        this.attackCancel();
    }
    var step = Math.ceil(distance / this.moveSpeed);
    if (step <= 0) { return; }
    var count = 1;
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
            clearInterval(this.interval_);
        }
    }.bind(this), 300);
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
 * 敵対行動を中止する
 */
Mob.prototype.attackCancel = function() {
   this.hateList = _.reject(this.hateList, function(h) {
       return h.entityId === this.hateTarget.id;
   }.bind(this));

    this.hateTarget = null;
};

/** @override */
Mob.prototype.beamHit = function(beamType, shooterId, mapId) {
    // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
    //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
    var beam = bq.Params.getBeamParam(beamType);
    var newEntity = entityStore.getMobById(mapId, this.model.id);
    var damage = Math.floor(Math.random() * beam.atk/2) + beam.atk; // TODO: ダメージ計算
    var newHp = newEntity.model.hp - damage;
    newEntity.model.hp = newHp;

    // 攻撃を与えたユーザのIDをヘイトリストに突っ込む
    var hateTarget = _.find(newEntity.hateList, function(h) {
        return h.entityId === shooterId;
    });

    if (!hateTarget) {
        newEntity.hateList.push({entityId: shooterId, hate: damage});
    } else {
        // ダメージ量がそのままヘイト値になる
        hateTarget.hate += damage;
    }

    // ヘイト値の大きい順にソートしておく
    this.hateList = _.sortBy(this.hateList, function(h) {return -h.hate;});
    entityStore.updateMobStatus(mapId, newEntity);

    return {hpAmount: -damage};
};

module.exports = Mob;