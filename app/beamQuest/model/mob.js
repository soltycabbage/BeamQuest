var util = require('util'),
    Entity = require('beamQuest/model/entity'),
    entityStore = require('beamQuest/store/entities'),
    entityListener = require('beamQuest/listener/entity');
/**
 * @constructor
 * @extends {model.Entity}
 */
var Mob = function(opt_data) {
    Entity.apply(this, arguments);
    this.scheduleUpdate();

    /**
     * 獲得経験値的な
     * @type {number}
     */
    this.exp = this.data.exp || Mob.DEFAULT_EXP;

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
     * 攻撃対象のEntityId
     * @type {string}
     */
    this.hateTargetId = null;

    /**
     * どのくらいの距離を離れたら敵視を解除するか(px)
     * @type {Number}
     */
    this.attackCancelDistance = 1000;
};
util.inherits(Mob, Entity);

Mob.DEFAULT_EXP = 1;

/** @override */
Mob.prototype.update = function() {
    if (!_.isEmpty(this.hateList)) {
        var targetId = this.hateList[0].entityId;
        var targetEntity = entityStore.getPlayerById(this.position.mapId, targetId);
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
    this.hateTargetId = entity.id;
    this.moveTo(entity.position)
    // io.sockets.emit('notify:entity:mob:attackTo', {mob: this.toJSON(), target: entityId});
};

/**
 * 移動
 * @param {model.Position}
 */
Mob.prototype.moveTo = function(pos) {
    var v = {x: pos.x - this.position.x, y: pos.y - this.position.y};
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

    this.position.x += vx;
    this.position.y += vy;
    this.updatePosition();

    clearInterval(this.interval_);
    this.interval_ = setInterval(function(){
        if (step > count++) {
            this.position.x += vx;
            this.position.y += vy;
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
    var entity = entityStore.getMobById(this.position.mapId, this.id);
    if (entity) {
        entity.position.x = this.position.x;
        entity.position.y = this.position.y;
        entityListener.moveMob(entity);
    }
};

/**
 * 敵対行動を中止する
 */
Mob.prototype.attackCancel = function() {
   this.hateList = _.reject(this.hateList, function(h) {
       return h.entityId === this.hateTargetId;
   }.bind(this));

    this.hateTargetId = null;
};

/** @override */
Mob.prototype.beamHit = function(beamType, shooterId, mapId) {
    // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
    //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
    var beam = bq.Params.getBeamParam(beamType);
    var newEntity = entityStore.getMobById(mapId, this.id);
    var damage = Math.floor(Math.random() * beam.atk/2) + beam.atk; // TODO: ダメージ計算
    var newHp = newEntity.hp - damage;
    newEntity.hp = newHp;

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

/** @override */
Mob.prototype.toJSON = function() {
    var json = Mob.super_.prototype.toJSON.apply(this);
    json.exp = this.exp;
    json.hateList = this.hateList;
    return json;
};

module.exports = Mob;