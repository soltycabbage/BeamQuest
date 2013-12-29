var util = require('util');
    Model = require('beamQuest/model/model');

/**
 * NPC, PC, mob などの基底クラス
 * @constructor
 */
var Entity = function() {
    Model.apply(this, arguments);

    this.id;
    this.name;
    this.position;
};
util.inherits(Entity, Model);

module.exports = Entity;