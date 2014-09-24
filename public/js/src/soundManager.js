/**
 * 音楽関係はマネージャーを通してくれる？
 * @constructor
 * @extends {cc.Class}
 */
bq.SoundManager = cc.Class.extend({
    DEFAULT_VOLUME: 1,

    /*
     *
     */
    ctor: function(options) {
        options = options || {};
        this.audioEngine = options.audioEngine || cc.audioEngine;
        this.musicVolume = options.musicVolume || this.DEFAULT_VOLUME;
        this.effectVolume = options.effectVolume || this.DEFAULT_VOLUME;
    },

    /*
     * 音楽を再生するよ
     */
    playMusic: function(musicFile, repeat, volume) {
        volume = volume || this.musicVolume;
        this.audioEngine.setMusicVolume(volume);
        this.audioEngine.playMusic(musicFile, repeat);
    },

    /*
     * SEを再生するよ
     */
    playEffect: function(effectFile, repeat, volume) {
        volume = volume || this.effectVolume;
        this.audioEngine.setEffectsVolume(volume);
        this.audioEngine.playEffect(effectFile, repeat);
    },

    /*
     * 音楽を停止するよ
     */
    stopMusic: function() {
        this.audioEngine.stopMusic();
    },

    /*
     * SEを全停止するよ
     */
    stopAllEffects: function() {
        this.audioEngine.stopAllEffects();
    },

    /*
     * 音楽をフェードアウトするよ
     * @param {number}   duration 何秒かけてフェードアウトするか
     * @param {function} callback 音楽停止後にcallされるcallback
     */
    fadeoutPlayingMusic: function(duration, callback) {
        callback = callback || function() {};
        var currentVolume = this.audioEngine.getMusicVolume();
        var action = this.createFadeoutSequence(duration, currentVolume, 0.0, callback);
        var target = new bq.SoundManager.MusicVolumeModificationActionTweenDelegate(this.audioEngine);
        var actionManager = cc.director.getActionManager();
        actionManager.addAction(action, target);
    },

    createFadeoutSequence_: function(duration, from, to, callback) {
        var actionSequence = [
            new cc.ActionTween(duration, 'dummy', from, to),
            new cc.CallFunc(this.stopMusic, this),
            new cc.CallFunc(callback)
        ];
        return new cc.Sequence(actionSequence);
    }
});

/**
 * cc.ActionTweenへのアンチテーゼ(意味不明)
 * @extends {cc.ActionTweenDelegate}
 */
bq.SoundManager.MusicVolumeModificationActionTweenDelegate = cc.ActionTweenDelegate.extend({
    ctor: function(audioEngine) {
        this.audioEngine = audioEngine;
    },

    updateTweenAction: function(value, key) {
        this.audioEngine.setMusicVolume(value);
    }
});

