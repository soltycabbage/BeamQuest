/**
 * @fileoverview アイテム、mob、ビームなどなど各種ステータスを定義していく
 */
require('shared/js/gameTypes');

bq.Params = {
    Beams: {
        NORMAL: {atk: 10, speed: 10, bp: 10},
        FIRE: {atk: 10, speed: 10, bp: 10}
    },

    Entities: {
        // Mobs
        KAMUTARO: {id: 'mob_kamutaro', name: 'カム太郎', hp: 100, atk: 10, exp: 10}
    }
};


/**
 * 引数にビームのtypeを与えるとビームのステータスを返す
 * @param {bq.Types.Beams} beamType
 * @return {bq.Prams.Beams}
 */
bq.Params.getBeamParam = function(beamType) {
    return bq.Params.Beams[beamType.toUpperCase()] || null;
};

/**
 * 引数にEntityのtypeを与えるとEntityのステータスを返す
 * @param {bq.Types.Entities} entityType
 * @return {bq.Prams.Entities}
 */
bq.Params.getEntityParam = function(entityType) {
    return bq.Params.Entities[entityType.toUpperCase()] || null;
};
