/**
 * @fileOverview リアルタイム進行するmobのPOPとかの処理を書いてく
 */
var entitiesStore = require('beamQuest/store/entities'),
    mapStore = require('beamQuest/store/maps'),
    mobModel = require('beamQuest/model/mob');

exports.run = function() {
    initMobs();

    function initMobs() {
        _.each(mapStore.getMaps(), function(map) {
            spawnMob(map);
        });
    };

    function spawnMob(map) {
        for(var i = 0;i < map.maxMobCount; i++) {
            // TODO: mapごとに出現モンスターとか決める
            var mob = new mobModel({
                id: 'mob_kamuraro_' + map.id + '_' + i,
                name: 'カム太郎'
            });
            entitiesStore.addMob(map.id, mob);
        }
    }

    // TODO: map.mobCount が一定数以下にならないように定期的にPOPさせる
};
