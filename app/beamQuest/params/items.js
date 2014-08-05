/**
 * @fileoverview entityの各種ステータスを定義
 */
var type_ = bq.Types.ItemType;
module.exports = {
    'beats': { // key名はクライアント側と合わせる必要が有るため、bq.Types.Items.BEATSと同じ文字列にしてください。
        type: type_.MONEY,
        name: 'ビーツ',
        info: 'この世界における貨幣。'
    },
    'potion': {
        type: type_.USE,
        name: 'ポーション',
        info: '赤キノコをすり潰して作った薬。体力を10%回復する。'
    }
};
