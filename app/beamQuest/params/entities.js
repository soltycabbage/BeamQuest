/**
 * @fileoverview entityの各種ステータスを定義
 */
bq.params.Entities = {
    // Mobs
    KAMUTARO: {
        // id: 識別用ID、 name: 表示名,
        id: 'mob_kamutaro', name: 'カム太郎',
        // hp: 体力, attack: 攻撃力, defence: 防御力, exp: もらえる経験値, money: 落とすビーツの量
        hp: 50, attack: 20, defence:10, exp: 30, money: 30,
        drop: [ // drop: 落とすアイテムのリスト
            // id: アイテムID, rate: 落とす割合（この場合は10分の1)
            {id: bq.Types.Items.POTION, rate: 1}
        ]
    }
};
