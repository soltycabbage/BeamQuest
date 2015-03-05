var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Skill = require('beamQuest/skill/skill');
/**
 * バイオショック
 * 対象にダメージ + 毒
 */
var BioShock = (function (_super) {
    __extends(BioShock, _super);
    function BioShock(model, user, targetpos) {
        _super.call(this, model, user, targetpos);
    }
    /** @override */
    BioShock.prototype.fire = function () {
        _super.prototype.fire.call(this);
        var damage = this.model.power + Math.floor(this.model.power * Math.random());
        this.applyDamage(damage, 10);
    };
    return BioShock;
})(Skill);
module.exports = BioShock;
//# sourceMappingURL=bioShock.js.map