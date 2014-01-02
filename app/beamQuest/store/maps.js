/**
 * ゲーム内のマップの状態を保持しておくクラス
 * @constructor
 */
var Maps = function() {
    /**
     * マップの状態としてもっておきたいもの
     * - マップID
     * - マップの名前
     * - マップ上に存在するmobの数（常に一定数になるようにPOPを調整したい時に使う）
     * 今のとこマップIDだけ。
     * @type {Array.<number>}
     * @private
     */
    this.maps_ = [];

    this.init_();
};

/**
 * @private
 */
Maps.prototype.init_ = function() {
    // NOTE マップ情報の保存先がまだ決まってないので直接書いてる。将来的にはファイルorDBから取ってくる？
    var mapIds = [1];
    _.each(mapIds, this.maps_.push);
};

/**
 * @return {Array.<number>}
 */
Maps.prototype.getMaps = function() {
    return this.maps_;
};

var instance_ = new Maps();

module.exports = instance_;