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
        bq.player.setPosition(cc.p(size.width / 2, size.height / 2));
        playerLayer.addChild(bq.player, 0);

        var tileMap = new cc.TMXTiledMap();
        tileMap.initWithTMXFile(bq.config.maps.area.SHINJUKU);
        tileMap.setPosition(cc.p(0,0));
        baseLayer.addChild(tileMap, 0);
        this.inputHandler = new InputHandler(bq.player);
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
    }
});

var BeamQuestWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        if (this.isAlreadyLogin_(bq.player.name)) {
            var layer = new BeamQuestWorld();
            layer.init();
            this.addChild(layer);
        } else {
            this.addChild(new LoginScene());
        }
    },

    /**
     * @param {string} userId
     * @return {boolean} ログイン済み（過去にログインしたことがある)ならTRUE
     * @private
     */
    isAlreadyLogin_: function(userId) {
        var userId = sys.localStorage.getItem('userHash:' + userId);
        return !!userId;
    }
});

