/**
 * @fileoverview アイテム、mob、ビームなどなど各種ステータスを定義していく
 */
require('shared/js/gameTypes');

bq.Params = {
    Beams: {
        /*
         *   id : gameTypes.jsに定義されてるid
         *   atk: 攻撃力
         *   speed: ビームの進むスピード
         *   duration: ビームの生存時間(sec)
         *   bp: 消費ポイント
         */
        NORMAL0:{id: bq.Types.Beams.NORMAL0, atk: 10, speed: 15,  duration: 0.5, bp: 1},
        NORMAL1:{id: bq.Types.Beams.NORMAL1, atk: 10, speed: 15,  duration: 0.5, bp: 1},
        NORMAL2:{id: bq.Types.Beams.NORMAL2, atk: 10, speed: 15,  duration: 1.0, bp: 1},
        FIRE:   {id: bq.Types.Beams.FIRE,    atk: 30, speed: 10, duration: 1.5, bp: 10},
        METEOR: {id: bq.Types.Beams.METEOR,  atk: 40, speed: 10, duration: 1.5, bp: 10}
    },

    Entities: {
        // Mobs
        KAMUTARO: {id: 'mob_kamutaro', name: 'カム太郎', hp: 100, atk: 10, exp: 2}
    },

    /**
     * 各レベルに必要な経験値テーブル
     * arrのindexがlevelに対応する
     * @type {Array.<number>}
     */
    Exp:[-1,
        0,     // LV1
        5,
        15,
        30,
        55,
        70,
        100,
        140,
        170,
        210,   // LV10
        238,
        300,
        374,
        486,
        622,
        785,
        977,
        1201,
        1501,
        1834,  // LV20
        2201,
        2605,
        3047,
        3679,
        4353,
        5073,
        5848,
        6682,
        7991,
        9373,
        10842, // LV30
        12421,
        14124,
        17252,
        20554,
        24080,
        27901,
        32067,
        40508,
        49419,
        58925, // LV40
        69239,
        80486,
        106695,
        134335,
        163904,
        196150,
        231571,
        253204,
        280932,
        310000 // LV50
    ]
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
