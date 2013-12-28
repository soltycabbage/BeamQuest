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
                SHINJUKU: 'res/map/shinjuku.tmx' // 新宿
            }
        };

        // Spriteのタグ（IDみたいなの）
        this.tags = {
            BASE_LAYER: 0,
            CHAT: 500,
            DEBUG_PING: 1000000
        };
    }
});

bq.config = new BQConfig();
