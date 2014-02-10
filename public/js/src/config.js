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
                START_MURA: s_StartVillageTmx // 最初の村
            }
        };

        // Spriteのタグ（IDみたいなの）
        this.tags = {
            BASE_LAYER: 0,
            PLAYER: 100,
            EXP_LABEL: 101,
            CHAT: 500,
            DEBUG_PING: 1000000
        };
    }
});

bq.config = new BQConfig();
