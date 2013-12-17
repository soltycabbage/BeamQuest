var BeamQuestWorld = cc.Layer.extend({
    init:function () {
        this._super();
        this.setKeyboardEnabled(true);

        var size = cc.Director.getInstance().getWinSize();

        var baseLayer = cc.Layer.create();
        baseLayer.setPosition(cc.p(0,0));
        this.addChild(baseLayer, 1, bq.config.tags.BASE_LAYER);

        var playerLayer = cc.Layer.create();
        playerLayer.setPosition(cc.p(0,0));
        this.addChild(playerLayer, 100, bq.config.tags.BASE_LAYER);


        // init frame cache
        var frameCache = cc.SpriteFrameCache.getInstance();
        frameCache.addSpriteFrames(s_PlayerWalkingPlist, s_PlayerWalkingImg); 


        var player = this.createPlayer_();
        player.setPosition(cc.p(size.width / 2, size.height / 2));
        playerLayer.addChild(player, 0);
        bq.player = player;



        var tileMap = new cc.TMXTiledMap();
        tileMap.initWithTMXFile(bq.config.maps.area.SHINJUKU);
        tileMap.setPosition(cc.p(0,0));
        baseLayer.addChild(tileMap, 0);
        this.inputHandler = new InputHandler(player);
        this.baseLayer = baseLayer;
        this.scheduleUpdate();
        return true;
    },

    /** @override */
    update: function() {
        var baseP = this.baseLayer.getPosition();
        var dx = this.inputHandler.dx;
        var dy = this.inputHandler.dy;
        if (dx !== 0 || dy !== 0) {
            this.baseLayer.setPosition(cc.p(baseP.x + dx, baseP.y + dy));
        }
    },

    /** @override */
    onKeyDown: function(key) {
        this.inputHandler.keyDown(key);
    },

    /** @override */
    onKeyUp: function(key) {
        this.inputHandler.keyUp(key);
    },
    
    /*
     * private method
     */

    createPlayer_: function() {
        var player = cc.Sprite.createWithSpriteFrameName("b0_0.png");
        var frameCache = cc.SpriteFrameCache.getInstance();

        var animation = cc.Animation.create();
        for (var i = 0; i < 7; i++) {
            var str = "b0_" + i + ".png";
            var frame = frameCache.getSpriteFrame(str);
            animation.addSpriteFrame(frame);
        }
        animation.setDelayPerUnit(0.1); 

        var forever = cc.RepeatForever.create(cc.Animate.create(animation));
        player.runAction(forever);

        return player;
    }
 
});

var BeamQuestWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BeamQuestWorld();
        layer.init();
        this.addChild(layer);
    }
});

