/**
 * @fileoverview entityの各種ステータスを定義
 */
module.exports = {
    // Mobs
    KAMUTARO: {
        // id: 識別用ID、 name: 表示名,
        id: 'mob_kamutaro', name: 'カム太郎',
        // hp: 体力, attack: 攻撃力, defence: 防御力, exp: もらえる経験値, money: 落とすビーツの量
        hp: 100, attack: 20, defence:10, exp: 3, money: 30,
        drop: [ // drop: 落とすアイテムのリスト
            // id: アイテムID, rate: 落とす割合（この場合は10分の1)
            {id: bq.Types.Items.POTION, rate: 1}
        ]
    },
    KAMUEATER: {
        // id: 識別用ID、 name: 表示名,
        id: 'mob_kamueater', name: 'カムイーター',
        // hp: 体力, attack: 攻撃力, defence: 防御力, exp: もらえる経験値, money: 落とすビーツの量
        hp: 300, attack: 100, defence: 20, exp: 20, money: 100,
        drop: [ // drop: 落とすアイテムのリスト
            // id: アイテムID, rate: 落とす割合（この場合は10分の1)
            {id: bq.Types.Items.POTION, rate: 1}
        ]
    }
};
