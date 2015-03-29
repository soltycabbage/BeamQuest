import MobModel = require('beamQuest/model/mob');
import PositionModel = require('beamQuest/model/position');
import EntitiesStore = require('beamQuest/store/entities');
import EntityCtrl = require('beamQuest/ctrl/entity');
import MobCtrl = require('beamQuest/ctrl/mob/mob');
import DropItem = require('beamQuest/model/dropItem');

declare var bq: any;

class FieldMap extends EntityCtrl {
    static POP_INTERVAL:number =  15000;
    constructor(map) {
        super();

        this.scheduleUpdate();

        this.model = map;

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
            // TODO: mapごとに出現モンスターとか決める
            var position = this.randomPosition_();
            var mobType = bq.params.Entities.KAMUTARO;
            var mob = new MobCtrl();
            var mobModel = new MobModel(mobType);
            mobModel.setId(mobType.id + '_' + this.model.id + '_' + i + '_' + timeStamp);
            mobModel.setPosition(position);
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
