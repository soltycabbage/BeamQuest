/**
 * @fileoverview スタティックファイルなど置く。g_resourcesで定義したものはゲーム開始前に事前にloadされる。
 */

// BeamQuest用のグローバル変数。こいつはどのコードからでも読み出し可能。
// 設定値とかを入れる。
bq.beams = [];

// Note. 各種接頭辞をつけてね。(ex. 画像ならs_Img)

// img
var s_ImgPlayer        = 'res/img/player.png';
var s_ImgChatTail      = 'res/img/chat_tail.png';
var s_ImgPlayerWalking = 'res/img/player/walk.png';
var s_ImgBeam0         = 'res/img/beam/star.png';
var s_ImgSimpleBeam    = 'res/img/beam/simple.png';
var s_ImgSmoke0        = 'res/img/beam/smoke.png';
var s_ImgPlayerMisc    = 'res/img/player/misc.png';

// tmx
// TODO s_Tmx, s_Tile はじまりにへんこー
var s_ShinjukuTmx        =  'res/map/shinjuku.tmx';
var s_ShinjukuMapSet     =  'res/map/shinjuku_mapset.png';
var s_StartVillageTmx    =  'res/map/map_village.tmx';
var s_StartVillageMapSet =  'res/map/tile_village.png';
var s_SmallVillageTmx    =  'res/map/map_small_village.tmx';
var s_SmallVillageMapSet =  'res/map/tile_small_village.png';

// plist
var s_PlistPlayerWalking =  'res/img/player/walk.plist';
var s_PlistSimpleBeam    =  'res/img/beam/simple.plist';
var s_PlistPlayerMisc    =  'res/img/player/misc.plist';

// sounds
var s_BgmField       = 'res/sounds/Field.m4a';
var s_SeBeamA        = 'res/sounds/BeamA.m4a';
var s_SeDamage       = 'res/sounds/Damage.ogg';
var s_SeNoDamage     = 'res/sounds/NoDamage.mp3';
var s_SeDeath1       = 'res/sounds/Death1.m4a';
var s_SeDeath2       = 'res/sounds/Death2.m4a';

var g_resources = [
    //img
    {type: 'image', src:s_ImgPlayer},
    //{type: 'image', src:s_ShinjukuMapSet},
    {type: 'image', src:s_StartVillageMapSet},
    {type: 'image', src:s_SmallVillageMapSet},
    {type: 'image', src:s_ImgChatTail},
    {type: 'image', src:s_ImgPlayerWalking},
    {type: 'image', src:s_ImgBeam0},
    {type: 'image', src:s_ImgSmoke0},
    {type: 'image', src:s_ImgSimpleBeam},

    //plist
    {type: 'plist', src:s_PlistPlayerWalking},
    {type: 'plist', src:s_PlistSimpleBeam},
    {type: 'plist', src:s_PlistPlayerMisc},

    //fnt

    //tmx
    //{type: 'tmx', src:s_ShinjukuTmx},
    {type: 'tmx', src:s_StartVillageTmx},
    {type: 'tmx', src:s_SmallVillageTmx},

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

