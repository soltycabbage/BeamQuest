/**
 * @fileoverview スタティックファイルなど置く。g_resourcesで定義したものはゲーム開始前に事前にloadされる。
 */

// BeamQuest用のグローバル変数。こいつはどのコードからでも読み出し可能。
// 設定値とかを入れる。
bq.beams = [];

// Note. 各種接頭辞をつけてね。(ex. 画像ならs_Img)

// img
// g_resourcesにも登録すること！
var s_ImgChatTail      = 'res/img/chat_tail.png';
var s_ImgPlayerWalking = 'res/img/player/walk.png';
var s_ImgSimpleBeam    = 'res/img/beam/simple.png';
var s_ImgPlayerMisc    = 'res/img/player/misc.png';
var s_ImgWorldMap      = 'res/img/worldmap.png';
var s_ImgMiniChara     = 'res/img/minichara.png';
var s_ImgEffectBurn    = 'res/img/effect/burn.png';
var s_ImgEffectPoison  = 'res/img/effect/poison.png';
var s_ImgEffectReactionPoison  = 'res/img/effect/reaction_poison.png';
var s_ImgParticleSmoke = 'res/img/beam/smoke.png';

// path prefix
var s_PrefixDropItem = 'res/img/object/dropitem/';

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
var s_PlistEffectBurn    =  'res/img/effect/burn.plist';
var s_PlistEffectExplode =  'res/img/effect/explodingRing.plist';
var s_PlistEffectPoison  =  'res/img/effect/poison.plist';
var s_PlistEffectReactionPoison  =  'res/img/effect/reaction_poison.plist';

// sounds
var s_BgmField       = 'res/sounds/bgm/Field.m4a';  // テンテテン　テン　テン
var s_BgmField2      = 'res/sounds/bgm/Field2.m4a'; // 草原チックなやつ

var s_SeBeamSimple1  = 'res/sounds/BeamSimple1.m4a';
var s_SeBeamSp1      = 'res/sounds/BeamAp1.m4a';
var s_SeDamage       = 'res/sounds/Damage.ogg';
var s_SeNoDamage     = 'res/sounds/NoDamage.mp3';
var s_SeDeath1       = 'res/sounds/Death1.m4a';
var s_SeDeath2       = 'res/sounds/Death2.m4a';
var s_SeLevelUp      = 'res/sounds/LevelUp.m4a';
var s_SeLogin        = 'res/sounds/Login.m4a';
var s_SeLogout       = 'res/sounds/Logout.m4a';
var s_SeTargetLine   = 'res/sounds/TargetLine.m4a';
var s_SeMoney        = 'res/sounds/Money.m4a';
var s_SePyu          = 'res/sounds/Pyu.m4a';
var s_SeError          = 'res/sounds/Error.m4a';

var g_resources = [
    //tmx
    //{type: 'tmx', src:s_ShinjukuTmx},
    {type: 'tmx', src:s_StartVillageTmx},
    {type: 'tmx', src:s_SmallVillageTmx},

    //img
    {type: 'png', src:s_StartVillageMapSet},
    {type: 'png', src:s_SmallVillageMapSet},
    {type: 'png', src:s_ImgChatTail},
    {type: 'png', src:s_ImgPlayerWalking},
    {type: 'png', src:s_ImgSimpleBeam},
    {type: 'png', src:s_ImgPlayerMisc},
    {type: 'png', src:s_ImgWorldMap},
    {type: 'png', src:s_ImgMiniChara},
    {type: 'png', src:s_ImgEffectBurn},
    {type: 'png', src:s_ImgEffectPoison},
    {type: 'png', src:s_ImgEffectReactionPoison},
    {type: 'png', src:s_ImgParticleSmoke},

    //plist
    {type: 'plist', src:s_PlistPlayerWalking},
    {type: 'plist', src:s_PlistSimpleBeam},
    {type: 'plist', src:s_PlistPlayerMisc},
    {type: 'plist', src:s_PlistEffectBurn},
    {type: 'plist', src:s_PlistEffectPoison},
    {type: 'plist', src:s_PlistEffectReactionPoison},
    //fnt

    //bgm
    {type: "m4a", src:s_BgmField},
    {type: "m4a", src:s_BgmField2},

    //effect
    {type: "m4a", src: s_SeMoney},
    {type: "m4a", src: s_SePyu},
    {type: "m4a", src: s_SeError},
];

var g_sprite_frames = [
];

// 敵の画像とか
var KINDS_OF_ENEMY = 2;
for (var i = 1; i <= KINDS_OF_ENEMY; i++) {
    var no = String('00' + i).slice(-3); // NOTE sprintf('%03d')
    var ename = 'res/img/enemy' + no;
    var image = ename + '.png';
    var plist = ename + '.plist';
    g_resources.push({type: 'png', src: image});
    g_resources.push({type: 'plist', src: plist});
    g_sprite_frames.push({image: image, plist: plist});
}

