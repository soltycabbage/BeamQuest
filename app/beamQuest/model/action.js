var util = require('util'),
    Model = require('beamQuest/model/model');

/**
 * Entityが使用するアクションのmodel
 * @constructor
 * @extends {model.Model}
 */
var Action = function(opt_data) {
    Model.apply(this, arguments);

    /**
     * アクションID
     * @type {string}
     */
    this.id = this.data.id;

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
};
