/**
 * @fileoverview サーバ側と共通して使う変数などを定義していく
 * @see https://github.com/mozilla/BrowserQuest/blob/master/shared/js/gametypes.js
 */

bq = {};

bq.Types = {
    Entities: {
        // keyを設定していく。valueはkeyの小文字でよろ
        PLAYER: 'player',

        // Mobs
        KAMUTARO: 'kamutaro'
    },

    Beams: {
        NORMAL0: 'normal0',
        NORMAL1: 'normal1',
        NORMAL2: 'normal2',
        NORMAL3: 'normal3',
        FIRE: 'fire',
        METEOR: 'meteor'
    }
};
