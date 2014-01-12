var util = require('util'),
    Entity = require('beamQuest/model/entity'),
    entities = require('beamQuest/store/entities');
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
     * ヘイトリスト
     * @type {Array.<Object.<entityId: string, hate: number>>}
     */
    this.hateList = [];

    /**
     * trueなら攻撃を受けるまで敵対行動を取らないタイプのmob
     * @type {Boolean}
     */
    this.isPassive = true;
};
util.inherits(Mob, Entity);

Mob.DEFAULT_EXP = 1;

/** @override */
Mob.prototype.update = function() {
    if (!_.isEmpty(this.hateList)) {
        var a= 1;
    }
};

/** @override */
Mob.prototype.beamHit = function(beamType, shooterId, mapId) {
    // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
    //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
    var beam = bq.Params.getBeamParam(beamType);
    var newEntity = entities.getMobById(mapId, this.id);
    var damage = Math.floor(Math.random() * beam.atk/2) + beam.atk; // TODO: ダメージ計算
    var newHp = newEntity.hp + damage;
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
    entities.updateMobStatus(mapId, newEntity);

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