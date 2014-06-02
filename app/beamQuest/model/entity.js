var util = require('util'),
    Model = require('beamQuest/model/model'),
    positionModel = require('beamQuest/model/position'),
    skillModel = require('beamQuest/model/skill');


/**
 * NPC, PC, mob などの基底クラス
 * @constructor
 * @extends {model.Model}
 */
var Entity = function(opt_data) {
    Model.apply(this, arguments);

    /** @type {string} */
    this.hash = this.data.hash;

    /** @type {number} */
    this.id = this.data.id;

    /** @type {string} */
    this.name = this.data.name;

    /**
     * さいだいHP
     * @type {number}
     */
    this.maxHp = this.data.maxHp || Entity.DEFAULT_MAX_HP;

    /**
     * 現在HP
     * @type {number}
     */
    this.hp = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;

    /**
     * 攻撃力
     * @type {number}
     */
    this.attack = this.data.attack || Entity.DEFAULT_ATTACK;

    /**
     * 防御力
     * @type {number}
     */
    this.defence = this.data.defence || Entity.DEFAULT_DEFENCE;

    /** @type {model.Position} */
    this.position = this.data.position || new positionModel();

    /**
     * 使用可能スキル一覧
     * @type {Array.<model.Skill>}
     */
    this.skills = this.data.skills || this.getPresetSkills_();
};
util.inherits(Entity, Model);

Entity.DEFAULT_MAX_HP = 100;
Entity.DEFAULT_ATTACK = 1;
Entity.DEFAULT_DEFENCE = 1;

/**
 * @param {string} id
 */
Entity.prototype.setId = function(id) {
    this.id = id;
};

/**
 * @param {model.Position} position
 */
Entity.prototype.setPosition = function(position) {
    this.position = position;
};

/**
 * HP の増減を行う
 * 減らす場合は負の数を指定
 *
 * @param {number} amount
 */
Entity.prototype.addHp = function(amount) {
    this.hp = Math.max(0, Math.min(this.maxHp, this.hp + amount));
    this.emit('addHp', amount);
};

/**
 * レベル1から習得してるスキルを返す
 * @return {Array.<mode.Skill>}
 * @private
 */
Entity.prototype.getPresetSkills_ = function() {
    var skills = [];
    skills.push(new skillModel(bq.params.Skills.BURNSTRIKE));
    return skills;
};

/** @override */
Entity.prototype.toJSON = function() {
    var json = {};
    json.hash = this.hash;
    json.id = this.id;
    json.name = this.name;
    json.maxHp = this.maxHp;
    json.hp =  this.hp;
    json.attack = this.attack;
    json.defence = this.defence;
    json.position = this.position.toJSON();
    json.skills = this.toArrayJSON(this.skills);
    return json;
};

module.exports = Entity;
