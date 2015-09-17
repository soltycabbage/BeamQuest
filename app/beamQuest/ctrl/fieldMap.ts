import MobModel = require('../model/mob');
import FieldMapModel = require('../model/fieldMap');
import PositionModel = require('../model/position');
import EntitiesStore = require('../store/entities');
import EntityCtrl = require('./entity');
import MobCtrl = require('./mob/mob');
import DropItem = require('../model/dropItem');
import Control = require('./ctrl');
import ScheduleTarget = require('../scheduleTarget');

declare var bq: any;

class FieldMap extends ScheduleTarget implements Control<FieldMapModel> {
    model:FieldMapModel;

    setModel(model:FieldMapModel) {
        this.model = model;
    }

    static POP_INTERVAL:number =  15000;
    constructor(map:FieldMapModel) {
        super();

        this.scheduleUpdate();
        this.setModel(map);

        setInterval(this.spawnMob_.bind(this), FieldMap.POP_INTERVAL);
    }

    update() {
        // ここに毎ループの処理を書いてくよ
    }

    /**
     * マップごとにmobを配置していく
     */
    private initMobs() {
        this.spawnMob_();
    }

    /**
     * Mapに決められたmobの最大数になるまでmobをpopさせる
     * @param {model.Map} map
     * @private
     */
    private spawnMob_() {
        var timeStamp = new Date().getTime() / 1;
        for(var i = this.model.mobCount;i < this.model.maxMobCount; i++) {
            // TODO: mapごとに出現の割合があってモンスターとか決める
            var position = this.randomPosition_();
            var mobType = ((Math.random()*10) <2) ? bq.params.Entities.KAMUTARO : bq.params.Entities.KAMUEATER;
            var mob = new MobCtrl();
            var mobModel = new MobModel(mobType);
            mobModel.mapId = this.model.id;
            mobModel.setId(mobType.id + '_' + this.model.id + '_' + i + '_' + timeStamp);
            mobModel.setPosition(position);
            mobModel.setMobImageId(mobType.image_id);
            mob.setModel(mobModel);
            mob.startPos = _.clone(position);
            EntitiesStore.getInstance().addMob(this.model, mob);
        }
    }

    /**
     * @param {model.Map}
     * @return {model.Position}
     */
    private randomPosition_(): PositionModel {
        var randX = Math.floor(Math.random() * this.model.size.width);
        var randY = Math.floor(Math.random() * this.model.size.height);
        var position = new PositionModel({
            mapId: this.model.id,
            x: randX,
            y: randY
        });
        return position;
    }

    /**
     * @param {Array.<model.DropItem>} items
     */
    public addDropItems(items:DropItem[]): void {
        this.model.addDropItems(items);
    }
}



module.exports = FieldMap;
