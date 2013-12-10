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
        
        return true;
    },

    /** @override */
    onKeyDown: function(key) {
        var baseP = this.baseLayer.getPosition();
        var dx = bq.config.maps.TILE_SIZE; // x移動量
        var dy = dx; // y移動量
        switch (key) {
            case cc.KEY.a:
                this.baseLayer.setPosition(cc.p(baseP.x + dx, baseP.y));
                break;
            case cc.KEY.s:
                this.baseLayer.setPosition(cc.p(baseP.x, baseP.y + dy));
                break;
            case cc.KEY.d:
                this.baseLayer.setPosition(cc.p(baseP.x - dx, baseP.y));
                break;
            case cc.KEY.w:
                this.baseLayer.setPosition(cc.p(baseP.x, baseP.y - dy));
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

