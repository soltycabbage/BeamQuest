var util = require('util');
    Model = require('beamQuest/model/model'),
    positionModel = require('beamQuest/model/position');


/**
 * NPC, PC, mob などの基底クラス
 * @constructor
 * @extends {model.Model}
 */
var Entity = function(opt_data) {
    Model.apply(this, arguments);

    /** @type {number} */
    this.id = opt_data.id;

    /** @type {string} */
    this.name = opt_data.name;

    /** @type {model.Position} */
    this.position = opt_data.position || new positionModel();
};
util.inherits(Entity, Model);

/** @override */
Entity.prototype.toJSON = function() {
   var json = {};
    json.id = this.id;
    json.name = this.name;
    json.position = this.position.toJSON();
    return json;
};

module.exports = Entity;