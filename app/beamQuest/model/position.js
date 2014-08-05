/// <reference path="model.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Model = require('beamQuest/model/model');

/**
* 位置情報
*/
var Position = (function (_super) {
    __extends(Position, _super);
    /**
    * @param opt_data
    */
    function Position(opt_data) {
        _super.call(this, opt_data);

        /** @type {number} */
        this.mapId = this.data.mapId || 1;

        /** @type {number} */
        this.x = this.data.x || 0;

        /** @type {number} */
        this.y = this.data.y || 0;
    }
    /**
    * @override
    * @returns {*}
    */
    Position.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.mapId = this.mapId;
        json.x = this.x;
        json.y = this.y;
        return json;
    };
    return Position;
})(Model);
module.exports = Position;
//# sourceMappingURL=position.js.map
