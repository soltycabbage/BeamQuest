var mapModel = require('beamQuest/model/fieldMap'),
    tmx = require('tmx-parser');

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
     * @type {Array.<model.Map>}
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
    var map = new mapModel({
        id: 1,
        name: 'しんじゅく', // TODO 最初の村の名前は? (iwg)
        maxMobCount: 10,
        mobCount: 0,
    });
    this.maps_.push(map);

    tmx.parseFile('public/res/map/map_village.tmx', function(err, m) {
        if (err) throw err;

        map.objTmx = m;
        map.size = {width: m.width * m.tileWidth, height: m.height * m.tileHeight};
    });
};

/**
 * @return {Array.<number>}
 */
Maps.prototype.getMaps = function() {
    return this.maps_;
};

/**
 * @param {number} mapId
 * @return {model.Map}
 */
Maps.prototype.getMapById = function(mapId) {
    return _.find(this.maps_, function(map) {
        return map.id === mapId;
    }) || null;
};

var instance_ = new Maps();

module.exports = instance_;