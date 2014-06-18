/**
 * @fileoverview ゲーム全体で使う設定値などはここに書いてけ
 * @author karihei
 */

var BQConfig = cc.Class.extend({
    version: "ver1.0",
    ctor: function() {
        'use strict';

        // マップに関する設定値
        this.maps = {
            TILE_SIZE: 32, // グリッド1マスのサイズ (px)
            area: { // エリアごとのマップファイルを定義していく
                SHINJUKU: s_ShinjukuTmx, // 新宿
                SMALL_MURA: s_SmallVillageTmx, // 小さい村
                START_MURA: s_StartVillageTmx, // 最初の村
                MU:         s_NoneTmx          // 無
            }
        };

        // SpriteのZOrder（重なり順)
        this.zOrder = {
            BASE_LAYER: 0,
            GROUND_EFFECT: 25, // 地面に描画されるエフェクト
            DROP_ITEM: 50,     // ドロップアイテム
            MAP: 100,          // tmxから生成したマップ
            PLAYER: 100,       // プレイヤー
            BEHIND_LAYER: 150, // 背後に回るとプレイヤーが隠れる（木の裏とか）
            EXP_LABEL: 200,
            CHAT: 500,
            DEBUG_PING: 1000000
        };
    }
});

bq.config = new BQConfig();
