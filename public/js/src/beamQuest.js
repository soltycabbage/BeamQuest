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

        var playerSprite = cc.Sprite.create(s_Player, cc.rect(0,0,32,32));
        playerSprite.setPosition(cc.p(size.width / 2, size.height / 2));

        var iwaSprite = cc.Sprite.create(s_Iwa);
        iwaSprite.setPosition(cc.p(size.width /2, size.height / 2 - 32));
        baseLayer.addChild(iwaSprite, 0);

        playerLayer.addChild(playerSprite, 0);

        var tileMap = new cc.TMXTiledMap();
        tileMap.initWithTMXFile(bq.config.maps.area.SHINJUKU);
        tileMap.setPosition(cc.p(0,0));
        baseLayer.addChild(tileMap, 0);

        this.baseLayer = baseLayer;
        this.scheduleUpdate();
        return true;
    },

    /** @override */
    update: function() {
        var baseP = this.baseLayer.getPosition();
        var dx = 1;//bq.config.maps.TILE_SIZE / 4; // x移動量
        var dy = dx; // y移動量
        if (this.moveLeft_) {
            this.baseLayer.setPosition(cc.p(baseP.x + dx, baseP.y));
        }
        if (this.moveDown_) {
            this.baseLayer.setPosition(cc.p(baseP.x, baseP.y + dy));
        }
        if (this.moveRight_) {
            this.baseLayer.setPosition(cc.p(baseP.x - dx, baseP.y));
        }
        if (this.moveUp_) {
            this.baseLayer.setPosition(cc.p(baseP.x, baseP.y - dy));
        }
    },

    /** @override */
    onKeyDown: function(key) {
        switch (key) {
            case cc.KEY.a:
                this.moveLeft_ = true;
                break;
            case cc.KEY.s:
                this.moveDown_ = true;
                break;
            case cc.KEY.d:
                this.moveRight_ = true;
                break;
            case cc.KEY.w:
                this.moveUp_ = true;
                break;
        }
    },
    /** @override */
    onKeyUp: function(key) {
        switch (key) {
            case cc.KEY.a:
                this.moveLeft_ = false;
                break;
            case cc.KEY.s:
                this.moveDown_ = false;
                break;
            case cc.KEY.d:
                this.moveRight_ = false;
                break;
            case cc.KEY.w:
                this.moveUp_ = false;
                break;
        }
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

