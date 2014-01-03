var util = require('util'),
    Entity = require('beamQuest/model/entity');

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