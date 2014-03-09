/**
 * ビームの設定値
 *   id : gameTypes.jsに定義されてるid
 *   atk: 攻撃力
 *   speed: ビームの進むスピード
 *   duration: ビームの生存時間(sec)
 *   bp: 消費ポイント
 */
bq.params.Beams = {
    NORMAL0:{id: bq.Types.Beams.NORMAL0, atk: 10, speed: 15,  duration: 0.5, bp: 1},
    NORMAL1:{id: bq.Types.Beams.NORMAL1, atk: 10, speed: 15,  duration: 0.5, bp: 1},
    NORMAL2:{id: bq.Types.Beams.NORMAL2, atk: 10, speed: 15,  duration: 1.0, bp: 1},
    FIRE:   {id: bq.Types.Beams.FIRE,    atk: 30, speed: 10, duration: 1.5, bp: 10},
    METEOR: {id: bq.Types.Beams.METEOR,  atk: 40, speed: 10, duration: 1.5, bp: 10}
};
