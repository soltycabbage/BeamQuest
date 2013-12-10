/**
 * @fileoverview ゲーム全体で使う設定値などはここに書いてけ
 * @author karihei
 */

var BQConfig = cc.Class.extend({
    ctor: function() {
        // マップに関する設定値
        this.maps = {
            TILE_SIZE: 32, // グリッド1マスのサイズ (px)
            area: { // エリアごとのマップファイルを定義していく
                SHINJUKU: 'res/map/shinjuku.tmx' // 新宿
            }
        };

        // Spriteのタグ（IDみたいなの）
        this.tags = {
            BASE_LAYER: 0
        }
    }}
);

bq.config = new BQConfig();
