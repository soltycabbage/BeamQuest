var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Entity = require('beamQuest/model/entity');
var Mob = (function (_super) {
    __extends(Mob, _super);
    function Mob(opt_dat) {
        _super.call(this, opt_dat);
        this.type = bq.Types.EntityType.MOB;
        this.exp = this.data.exp || Mob.DEFAULT_EXP;
        this.moveSpeed = 5;
        this.isPassive = true;
        this.drop = this.data.drop || [];
        this.money = this.data.money || 0;
        this.maxHp = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;
    }
    Mob.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.exp = this.exp;
        return json;
    };
    Mob.DEFAULT_EXP = 1;
    return Mob;
})(Entity);
module.exports = Mob;
//# sourceMappingURL=mob.js.map