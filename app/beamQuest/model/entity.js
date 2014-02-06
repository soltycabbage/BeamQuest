var util = require('util'),
    Model = require('beamQuest/model/model'),
    positionModel = require('beamQuest/model/position');


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


    /** @type {model.Position} */
    this.position = this.data.position || new positionModel();
};
util.inherits(Entity, Model);

Entity.DEFAULT_MAX_HP = 100;

Entity.prototype.addHp = function(amount) {
    var expectHp = this.hp + amount;
    if (expectHp > this.maxHp) {
        this.hp = this.maxHp;
    } else if (expectHp <= 0) { // HP0以下
        this.hp = 0;
    } else {
        this.hp = expectHp;
    }
    this.emit('updateHp', this, amount);
}

/** @override */
Entity.prototype.toJSON = function() {
    var json = {};
    json.hash = this.hash;
    json.id = this.id;
    json.name = this.name;
    json.maxHp = this.maxHp;
    json.hp =  this.hp;
    json.position = this.position.toJSON();
    return json;
};

module.exports = Entity;
