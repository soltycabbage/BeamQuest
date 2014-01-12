var util = require('util'),
    Entity = require('beamQuest/model/entity'),
    entities = require('beamQuest/store/entities');
/**
 * @constructor
 * @extends {model.Entity}
 */
var Mob = function(opt_data) {
    Entity.apply(this, arguments);

    /**
     * 獲得経験値的な
     * @type {number}
     */
    this.exp = this.data.exp || Mob.DEFAULT_EXP;

    /**
     * ヘイトリスト
     * @type {Array.<string>}
     */
    this.hateList = [];
};
util.inherits(Mob, Entity);

Mob.DEFAULT_EXP = 1;

/** @override */
Mob.prototype.beamHit = function(beamType, shooterId, mapId) {
    var hitResult = {};

    // TODO: ほんとはクライアント側から指定されたビームtypeをそのまま使うべきではない
    //       サーバ側に保存してあるプレイヤーの装備しているビームを参照すべき
    var beam = bq.Params.getBeamParam(beamType);
    var newEntity = entities.getMobById(mapId, this.id);
    var damage = -1 * (Math.floor(Math.random() * beam.atk/2) + beam.atk); // TODO: ダメージ計算
    var newHp = newEntity.hp + damage;
    newEntity.hp = newHp;

    // 攻撃を与えたユーザのIDをヘイトリストに突っ込む
        // TODO: ヘイト値の導入
    if (!_.contains(newEntity.hateList, shooterId)) {
        newEntity.hateList.push(shooterId);
    }
    entities.updateMobStatus(mapId, newEntity);
    hitResult.hpAmount = damage;
    return hitResult;
};

/** @override */
Mob.prototype.toJSON = function() {
    var json = Mob.super_.prototype.toJSON.apply(this);
    json.exp = this.exp;
    json.hateList = this.hateList;
    return json;
};

module.exports = Mob;