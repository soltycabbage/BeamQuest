/// <reference path="../../../typings/tmx-parser/tmx-parser.d.ts" />
/// <reference path="../../../typings/deferred/deferred.d.ts" />

import mapModel = require('beamQuest/model/fieldMap');
import FieldMapCtrl = require('beamQuest/ctrl/fieldMap');

/**
 * ゲーム内のマップの状態を保持しておくクラス
 * @constructor
 */
class Maps {
    private static instance_:Maps;
    public static getInstance():Maps {
        if (Maps.instance_ === undefined) {
            Maps.instance_ = new Maps();
        }
        return Maps.instance_;
    }

    constructor() {
        if (Maps.instance_){
            throw new Error("Error: Instantiation failed: Use Maps.getInstance() instead of new.");
        }
        Maps.instance_ = this;

        this.maps_ = [];
    }

    /**
     * マップの状態としてもっておきたいもの
     * - マップID
     * - マップの名前
     * - マップ上に存在するmobの数（常に一定数になるようにPOPを調整したい時に使う）
     * - マップ上のドロップアイテム
     * @type {Array.<ctrl.FieldMap>}
     * @private
     */
    private maps_:any[];

    /**
     * 一時的に中の処理を mani.js に投げた．
     * 詳細はコミットログを参照
     */
    init() {

    }

    /**
     * @return {Array.<ctrl.FieldMap>}
     */
    getMaps ():any {
        return this.maps_;
    }

    /**
     * @param {number} mapId
     * @return {ctrl.FieldMap}
     */
    getMapById(mapId:number): any {
        return _.find(this.maps_, (map) => {
            return map.model.id === mapId;
        }) || null;
    }
}

export = Maps;
