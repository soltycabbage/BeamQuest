var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * Entityが使用するスキルのmodel
 * @constructor
 * @extends {model.Model}
 */
var Skill = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * スキルID
     * @type {string}
     */
    this.id = this.data.id;

    /**
     * スキル名
     * @type {string}
     */
    this.name = this.data.name;

    /**
     * スキルの説明文
     * @type {string}
     */
    this.info = this.data.info;

    /**
     * 消費BP
     * @type {number}
     */
    this.bp = this.data.bp;

    /**
     * キャストタイム。使用開始してから発動するまでの時間(msec)
     * @type {number}
     */
    this.castTime = this.data.castTime;

    /**
     * リキャストタイム。発動してから再使用可能になるまでの時間(msec)
     * @type {number}
     */
    this.recastTime = this.data.recastTime;

    /**
     * 射程距離(px)
     * @type {number}
     */
    this.range = this.data.range;

    /**
     * 有効半径(px)
     * @type {number}
     */
    this.radius = this.data.radius;
};

/** @override */
Skill.prototype.toJSON = function() {
    var json = {};
    json.id = this.id;
    json.name = this.name;
    json.info = this.info;
    json.bp = this.bp;
    json.castTime = this.castTime;
    json.recastTime = this.recastTime;
    json.range = this.range;
    json.radius = this.radius;
    return json;
};

module.exports = Skill;