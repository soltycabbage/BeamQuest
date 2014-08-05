/// <reference path="model.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');

/**
* Entityが使用するスキルのmodel
* @extends {model.Model}
*/
var Skill = (function (_super) {
    __extends(Skill, _super);
    /**
    * @param opt_data
    */
    function Skill(opt_data) {
        _super.call(this, opt_data);

        this.id = this.data.id;
        this.name = this.data.name;
        this.info = this.data.info;
        this.bp = this.data.bp;
        this.castTime = this.data.castTime;
        this.recastTime = this.data.recastTime;
        this.range = this.data.range;
        this.radius = this.data.radius;
    }
    /** @override */
    Skill.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.id = this.id;
        json.name = this.name;
        json.info = this.info;
        json.bp = this.bp;
        json.castTime = this.castTime;
        json.recastTime = this.recastTime;
        json.range = this.range;
        json.radius = this.radius;
        return json;
    };
    return Skill;
})(Model);

module.exports = Skill;
//# sourceMappingURL=skill.js.map
