/**
 * @fileoverview スタティックファイルなど置く。g_resourcesで定義したものはゲーム開始前に事前にloadされる。
 */

// BeamQuest用のグローバル変数。こいつはどのコードからでも読み出し可能。
// 設定値とかを入れる。
bq.beams = [];

// img
var s_Player = 'res/img/player.png';
var s_ChatTail = 'res/img/chat_tail.png';
var s_PlayerWalkingImg = 'res/img/walk_anime.png';
var s_beam0 = 'res/img/star.png';
var s_smoke0 = 'res/img/smoke.png';
var s_mute01 = 'res/img/mute01.png';
var s_mute02 = 'res/img/mute02.png';

// tmx
var s_ShinjukuTmx = 'res/map/shinjuku.tmx';
var s_MapSet= 'res/map/mapset.png';

// plist
var s_PlayerWalkingPlist = 'res/img/walk_anime.plist';

// sounds
var s_BgmField = 'res/sounds/Field.m4a';
var s_SeBeamA = 'res/sounds/BeamA.m4a';
var s_SeDamage = 'res/sounds/Damage.ogg';

var g_resources = [
    //img
    {type: 'image', src:s_Player},
    {type: 'image', src:s_MapSet},
    {type: 'image', src:s_ChatTail},
    {type: 'image', src:s_PlayerWalkingImg},
    {type: 'image', src:s_beam0},
    {type: 'image', src:s_smoke0},
    {type: 'image', src:s_mute01},
    {type: 'image', src:s_mute02},

    //plist
    {type: 'plist', src:s_PlayerWalkingPlist},

    //fnt

    //tmx
    {type: 'tmx', src:s_ShinjukuTmx},

    //bgm
    {type:"bgm",src:s_BgmField},
    {type:"bgm",src:s_SeBeamA}

    //effect
];

var g_sprite_frames = [
];

// 敵の画像とか
var KINDS_OF_ENEMY = 1;
for (var i = 1; i <= KINDS_OF_ENEMY; i++) {
    var no = String('00' + i).slice(-3); // NOTE sprintf('%03d')
    var name = 'res/img/enemy' + no;
    var image = name + '.png';
    var plist = name + '.plist';
    g_resources.push({type: 'image', src: image});
    g_resources.push({type: 'plist', src: plist});
    g_sprite_frames.push({image: image, plist: plist});
}

