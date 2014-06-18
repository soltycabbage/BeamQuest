/**
 * @fileoverview スキル一覧
 */
bq.params.Skills = {
    BURNSTRIKE: { // 炎系範囲魔法。バーンストライク！相手は死ぬ。
        id: '001_burnstrike',   // ID あたまに連番(001_)振ってね. bq.Types.Skillsにも定義すること。
        name: 'バーンストライク', // 表示用の名前
        info: '炎で周囲を焼き払う下級光術。',
        bp: 10,                 // 消費BP
        castTime: 1000,         // キャストタイム(msec)
        recastTime: 5000,       // リキャストタイム(msec)
        range: 100,             // 射程距離(px)
        radius: 100             // 有効半径(px)
    }
};