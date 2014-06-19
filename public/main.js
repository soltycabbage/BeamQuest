cc.game.onStart = function(){
    // initialize director

    // cc.EGLView.getInstance()._adjustSizeToBrowser();
    // cc.EGLView.getInstance()._resizeWithBrowserSize(true);
    cc.view.setDesignResolutionSize(1040, 620, cc.ResolutionPolicy.SHOW_ALL);

    // turn on display FPS
    cc.director.setDisplayStats(this.config['showFPS']);

    // set FPS. the default value is 1.0/60 if you don't call this
    cc.director.setAnimationInterval(1.0 / this.config['frameRate']);

    // initialize sound manager
    bq.soundManager = new bq.SoundManager({
        musicVolume:  1.0,
        effectVolume: 1.0
    });

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        // preload sprite frames
        _.forEach(g_sprite_frames, function(spriteFrame) {
            cc.spriteFrameCache.addSpriteFrames(spriteFrame.plist, spriteFrame.image);
        });
        cc.director.runScene(new bq.scene.LoginScene());
    }, this);

};

cc.game.run();
