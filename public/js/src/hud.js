bq.Hud = cc.Layer.extend({
    ctor: function() {
        this._super();
        this.initMuteButton_();
    },

    initMuteButton_: function() {
        this.muteImage = cc.MenuItemImage.create(s_mute01, s_mute01);
        this.unmuteImage = cc.MenuItemImage.create(s_mute02, s_mute02);
        this.muteButton = cc.MenuItemToggle.create(this.unmuteImage, this.muteImage, this.onClickMuteButton, this);
        var muteMenu = cc.Menu.create(this.muteButton);
        var winSize = cc.Director.getInstance().getWinSize();
        muteMenu.setPosition(cc.p(winSize.width - 15, winSize.height - 15));
        this.addChild(muteMenu);
    },

    onClickMuteButton: function(sender) {
        var audioEngine = cc.AudioEngine.getInstance();
        if (sender.selectedItem() == this.unmuteImage) {
            audioEngine.setMusicVolume(this.currentMusicVolume);
            audioEngine.setEffectsVolume(this.currentEffectsVolume);
        }
        else if (sender.selectedItem() == this.muteImage) {
            this.currentMusicVolume = audioEngine.getMusicVolume();
            this.currentEffectsVolume = audioEngine.getEffectsVolume();
            audioEngine.setMusicVolume(0);
            audioEngine.setEffectsVolume(0);
        }
    },

});
