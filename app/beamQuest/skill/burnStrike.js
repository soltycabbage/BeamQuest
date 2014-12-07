/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Skill = require('beamQuest/skill/skill');
/**
 * バーンストライク
 */
var BurnStrike = (function (_super) {
    __extends(BurnStrike, _super);
    function BurnStrike(model, user, targetpos) {
        _super.call(this, model, user, targetpos);
        this.interval_ = null;
        this.dotcount_ = 0;
        this.maxdotcount_ = 10;
    }
    /** @override */
    BurnStrike.prototype.fire = function () {
        var _this = this;
        _super.prototype.fire.call(this);
        this.interval_ = setInterval(function () {
            if (_this.dotcount_++ > _this.maxdotcount_) {
                clearInterval(_this.interval_);
            }
            var damage = _this.model.power + Math.floor(_this.model.power * Math.random());
            _this.applyDamage(damage, 20);
        }, 500);
    };
    return BurnStrike;
})(Skill);
module.exports = BurnStrike;
//# sourceMappingURL=burnStrike.js.map