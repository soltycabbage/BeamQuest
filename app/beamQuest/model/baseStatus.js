var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');
/**
 * Entityの基本ステータス
 */
var BaseStatus = (function (_super) {
    __extends(BaseStatus, _super);
    function BaseStatus(opt_data) {
        _super.call(this, opt_data);
        this.con = this.data.con || 1;
        this.int = this.data.int || 1;
        this.str = this.data.str || 1;
        this.def = this.data.def || 1;
        this.sns = this.data.sns || 1;
        this.luk = this.data.luk || 1;
    }
    BaseStatus.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.con = this.con;
        json.int = this.int;
        json.str = this.str;
        json.def = this.def;
        json.sns = this.sns;
        json.luk = this.luk;
        return json;
    };
    return BaseStatus;
})(Model);
module.exports = BaseStatus;
//# sourceMappingURL=baseStatus.js.map