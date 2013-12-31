var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            //show Information to user
            alert("Browser doesn't support WebGL");
            return false;
        }
        // initialize director
        var director = cc.Director.getInstance();

        // cc.EGLView.getInstance()._adjustSizeToBrowser();
        // cc.EGLView.getInstance()._resizeWithBrowserSize(true);
        cc.EGLView.getInstance().setDesignResolutionSize(1040, 620, cc.RESOLUTION_POLICY.SHOW_ALL);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // initialize audio engine
        cc.AudioEngine.getInstance().init("aac,mp3,ogg,wav");

        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            // preload sprite frames
            var frameCache = cc.SpriteFrameCache.getInstance();
            _.forEach(g_sprite_frames, function(spriteFrame) {
                frameCache.addSpriteFrames(spriteFrame.plist, spriteFrame.image);
            });
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});
var BeamQuestApp = new cocos2dApp(bq.scene.LoginScene);
