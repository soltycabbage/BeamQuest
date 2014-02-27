var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * Entityの基本ステータス
 * @constructor
 * @extends {model.Model}
 */
var BaseStatus = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * 体力
     * HPが上がる
     * @type {number}
     */
    this.con = this.data.con || 1;

    /**
     * 知力
     * BPが上がる
     * @type {number}
     */
    this.int = this.data.int || 1;

    /**
     * 筋力
     * 攻撃力があがる。この世界では筋力の強さがビームの強さになる、というテイで
     * @type {number}
     */
    this.str = this.data.str || 1;

    /**
     * 体幹
     * 防御力が上がる
     * @type {number}
     */
    this.def = this.data.def || 1;

    /**
     * センス
     * @type {number}
     */
    this.sns = this.data.sns || 1;

    /**
     * 運
     * クリティカルヒットとか。たまに経験値もクリティカルヒットする
     * @type {number}
     */
    this.luk = this.data.luk || 1;
};
util.inherits(BaseStatus, Model);

/** @override */
BaseStatus.prototype.toJSON = function() {
    var json = {};
    json.con = this.con;
    json.int = this.int;
    json.str = this.str;
    json.def = this.def;
    json.sns = this.sns;
    json.luk = this.luk;
    return json;
};

module.exports = BaseStatus;