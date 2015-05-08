/// <reference path="../../../typings/tmx-parser/tmx-parser.d.ts" />
/// <reference path="../../../typings/deferred/deferred.d.ts" />

import mapModel = require('beamQuest/model/fieldMap');
import FieldMapCtrl = require('beamQuest/ctrl/fieldMap');

/**
 * ゲーム内のマップの状態を保持しておくモジュール
 */

/**
 * マップの状態としてもっておきたいもの
 * - マップID
 * - マップの名前
 * - マップ上に存在するmobの数（常に一定数になるようにPOPを調整したい時に使う）
 * - マップ上のドロップアイテム
 * @type {Array.<ctrl.FieldMap>}
 * @private
 */
var maps_:any[] = [];

/**
 * @return {Array.<ctrl.FieldMap>}
 */
export function getMaps(): any {
    return maps_;
}

/**
 * @param {number} mapId
 * @return {ctrl.FieldMap}
 */
export function getMapById(mapId:number): any {
    return _.find(maps_, (map) => map.model.id === mapId ) || null;
}
