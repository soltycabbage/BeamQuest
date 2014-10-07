/// <reference path="../../../typings/tmx-parser/tmx-parser.d.ts" />
/// <reference path="../../../typings/deferred/deferred.d.ts" />
/**
 * ゲーム内のマップの状態を保持しておくクラス
 * @constructor
 */
var Maps = (function () {
    function Maps() {
        if (Maps.instance_) {
            throw new Error("Error: Instantiation failed: Use Maps.getInstance() instead of new.");
        }
        Maps.instance_ = this;
        this.maps_ = [];
    }
    Maps.getInstance = function () {
        if (Maps.instance_ === undefined) {
            Maps.instance_ = new Maps();
        }
        return Maps.instance_;
    };
    /**
     * 一時的に中の処理を mani.js に投げた．
     * 詳細はコミットログを参照
     */
    Maps.prototype.init = function () {
    };
    /**
     * @return {Array.<ctrl.FieldMap>}
     */
    Maps.prototype.getMaps = function () {
        return this.maps_;
    };
    /**
     * @param {number} mapId
     * @return {ctrl.FieldMap}
     */
    Maps.prototype.getMapById = function (mapId) {
        return _.find(this.maps_, function (map) {
            return map.model.id === mapId;
        }) || null;
    };
    return Maps;
})();
module.exports = Maps;
//# sourceMappingURL=maps.js.map