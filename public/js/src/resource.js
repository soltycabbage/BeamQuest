/**
 * @fileoverview スタティックファイルなど置く。g_resourcesで定義したものはゲーム開始前に事前にloadされる。
 */

// BeamQuest用のグローバル変数。こいつはどのコードからでも読み出し可能。
// 設定値とかを入れる。
var bq = {};

// img
var s_Player = 'res/img/player.png';
var s_Iwa = 'res/img/iwa.png';

// tmx
var s_ShinjukuTmx = 'res/map/shinjuku.tmx';
var s_MapSet= 'res/map/mapset.png';

var g_resources = [
    //img
    {type: 'image', src:s_Player},
    {type: 'image', src:s_MapSet},

    //plist

    //fnt

    //tmx
    {type: 'tmx', src:s_ShinjukuTmx}

    //bgm

    //effect
];