var util = require('util'),
    Entity = require('beamQuest/model/entity');

/**
 * @constructor
 * @extends {model.Entity}
 */
var Mob = function(opt_data) {
    Entity.apply(this, arguments);

    /** @override */
    this.type = bq.Types.EntityType.MOB;

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
     * trueなら攻撃を受けるまで敵対行動を取らないタイプのmob
     * @type {Boolean}
     */
    this.isPassive = true;

    /**
     * ドロップするアイテムのリスト
     * @type {Array.<Object>}
     */
    this.drop = this.data.drop || [];

    /**
     * ドロップするビーツの量
     * @type {number}
     */
    this.money = this.data.money || 0;

    /**
     * 敵の場合は最大HPを設定値から取得してくる
     * @type {number}
     */
    this.maxHp = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;
};
util.inherits(Mob, Entity);

Mob.DEFAULT_EXP = 1;

/** @override */
Mob.prototype.toJSON = function() {
    var json = Mob.super_.prototype.toJSON.apply(this);
    json.exp = this.exp;
    return json;
};

module.exports = Mob;