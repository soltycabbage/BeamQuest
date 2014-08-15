var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');
var Position = require('beamQuest/model/position');
var Skill = require('beamQuest/model/skill');

/**
* NPC, PC, mob などの基底クラス
*/
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(opt_data) {
        _super.call(this, opt_data);

        this.hash = this.data.hash;
        this.id = this.data.id;
        this.type = this.data.type;
        this.name = this.data.name;
        this.maxHp = this.data.maxHp || Entity.DEFAULT_MAX_HP;
        this.hp = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;
        this.attack = this.data.attack || Entity.DEFAULT_ATTACK;
        this.defence = this.data.defence || Entity.DEFAULT_DEFENCE;
        this.position = this.data.position || new Position(null);
        this.skills = this.data.skills || this.getPresetSkills();
    }
    Entity.prototype.setId = function (id) {
        this.id = parseInt(id);
    };

    Entity.prototype.setPosition = function (position) {
        this.position = position;
    };

    /**
    * HP の増減を行う
    * 減らす場合は負の数を指定
    *
    * @param {number} amount
    * @param {boolean=} opt_isCritical クリティカルヒットの場合true
    */
    Entity.prototype.addHp = function (amount, opt_isCritical) {
        this.hp = Math.max(0, Math.min(this.maxHp, this.hp + amount));
        this.emit('addHp', amount, !!opt_isCritical);
    };

    /**
    * レベル1から習得してるスキルを返す
    * @return {Array.<mode.Skill>}
    * @private
    */
    Entity.prototype.getPresetSkills = function () {
        var skills = [];
        skills.push(new Skill(bq.params.Skills.BURNSTRIKE));
        return skills;
    };

    Entity.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.hash = this.hash;
        json.id = this.id;
        json.type = this.type;
        json.name = this.name;
        json.maxHp = this.maxHp;
        json.hp = this.hp;
        json.attack = this.attack;
        json.defence = this.defence;
        json.position = this.position.toJSON();
        json.skills = this.toArrayJSON(this.skills);
        return json;
    };
    Entity.DEFAULT_MAX_HP = 100;
    Entity.DEFAULT_ATTACK = 1;
    Entity.DEFAULT_DEFENCE = 1;
    return Entity;
})(Model);

module.exports = Entity;
//# sourceMappingURL=entity.js.map
