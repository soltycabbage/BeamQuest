/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

import events = require('events');

class Model extends events.EventEmitter {
    data: Object;

    constructor(opt_data: Object) {
        super();
        this.data = opt_data || {};
    }

    /**
     * @returns {{}}
     * @protected
     */
    toJSON() {
        return {};
    }

    /**
     * Objectに入った各modelをtoJSON()して返す
     * @param {Object.<Model>} obj
     * @return {Object.<Object>}
     * @protected
     */
    toObjectJSON(obj: Model[]) {
        var result: Object = {};
        _.forEach(obj, function(value, key) {
            result[key] = value.toJSON();
        });
        return result;
    }

    /**
     * 配列に入った各modelをtoJSON()して返す
     * @param {Array.<Model>} arr
     * @return {Array.<Object>}
     * @protected
     */
     toArrayJSON(arr: Model[]): Object[] {
        var result: Object[] = [];
        _.forEach(arr, function(model) {
            if (model.toJSON) {
                result.push(model.toJSON());
            } else {
                result.push(model);
            }

        });
        return result;
    }
}

module.exports = Model;
