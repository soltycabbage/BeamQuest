import Model = require('beamQuest/model/model');

/**
 * 位置情報
 */
class Position extends Model {
    mapId: Number;
    x: Number;
    y: Number;

    /**
     * @param opt_data
     */
    constructor(opt_data) {
        super(opt_data);

        /** @type {number} */
        this.mapId = this.data.mapId || 1;

        /** @type {number} */
        this.x = this.data.x || 0;

        /** @type {number} */
        this.y = this.data.y || 0;
    }

    /**
     * @override
     * @returns {*}
     */
    toJSON(): any {
        var json = super.toJSON();
        json.mapId =  this.mapId;
        json.x =  this.x;
        json.y = this.y;
        return json;
    }
}
export = Position;
