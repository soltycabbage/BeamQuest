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

        var player = new Player(s_Player, cc.rect(0,0,32,32));
        player.setPosition(cc.p(size.width / 2, size.height / 2));
        playerLayer.addChild(player, 0);
        this.player = player;

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
        if (this.dx_ !== 0 || this.dy_ !== 0) {
            this.baseLayer.setPosition(cc.p(baseP.x + this.dx_, baseP.y + this.dy_));
        }
    },

    /** @override */
    onKeyDown: function(key) {
        switch (key) {
            case cc.KEY.a:
                this.dx_ = this.player.moveSpeed;
                break;
            case cc.KEY.s:
                this.dy_ = this.player.moveSpeed;
                break;
            case cc.KEY.d:
                this.dx_ = -1 * this.player.moveSpeed;
                break;
            case cc.KEY.w:
                this.dy_ = -1 * this.player.moveSpeed;
                break;
        }
    },
    /** @override */
    onKeyUp: function(key) {
        switch (key) {
            case cc.KEY.a:
            case cc.KEY.d:
                this.dx_ = 0;
                break;
            case cc.KEY.s:
            case cc.KEY.w:
                this.dy_ = 0;
                break;
            default:
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

