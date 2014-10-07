/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require('events');
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(opt_data) {
        _super.call(this);
        this.data = opt_data || {};
    }
    /**
     * @returns {{}}
     * @protected
     */
    Model.prototype.toJSON = function () {
        return {};
    };
    /**
     * Objectに入った各modelをtoJSON()して返す
     * @param {Object.<Model>} obj
     * @return {Object.<Object>}
     * @protected
     */
    Model.prototype.toObjectJSON = function (obj) {
        var result = {};
        _.forEach(obj, function (value, key) {
            result[key] = value.toJSON();
        });
        return result;
    };
    /**
     * 配列に入った各modelをtoJSON()して返す
     * @param {Array.<Model>} arr
     * @return {Array.<Object>}
     * @protected
     */
    Model.prototype.toArrayJSON = function (arr) {
        var result = [];
        _.forEach(arr, function (model) {
            if (model.toJSON) {
                result.push(model.toJSON());
            }
            else {
                result.push(model);
            }
        });
        return result;
    };
    return Model;
})(events.EventEmitter);
module.exports = Model;
//# sourceMappingURL=model.js.map