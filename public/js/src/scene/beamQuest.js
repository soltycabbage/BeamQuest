bq.scene.BeamQuestWorld = cc.Layer.extend({
    init:function () {
        'use strict';

        this._super();
        this.setKeyboardEnabled(true);
        var platform = cc.Application.getInstance().getTargetPlatform();
        if (platform === cc.TARGET_PLATFORM.MOBILE_BROWSER) {
            this.setTouchEnabled(true);
        } else {
            this.setMouseEnabled(true);
        }

        // TODO position.mapIdからロードするマップを取得する
        var tileMap = new cc.TMXTiledMap();
        tileMap.initWithTMXFile(bq.config.maps.area.START_MURA);
        tileMap.setPosition(cc.p(0,0));

        var behindMapLayer = tileMap.getLayer('GoBehind');
        behindMapLayer.setZOrder(bq.config.zOrder.BEHIND_LAYER);
        var mapManager = new bq.MapManager(tileMap);
        bq.mapManager = mapManager;

        var baseLayer = tileMap;
        baseLayer.setPosition(cc.p(0,0));
        baseLayer.addChild(bq.player, bq.config.zOrder.PLAYER);

        this.camera = new bq.Camera(baseLayer);
        this.camera.lookAt(bq.player);
        bq.camera = this.camera;

        var chat = new bq.Chat();
        this.inputHandler = new bq.InputHandler();
        this.inputHandler.attach(this);
        this.inputHandler.addListener(bq.player.inputHandler);
        this.inputHandler.addListener({
            onKeyDown: function(key) {
                if (key === cc.KEY.enter) {
                    chat.focusChat();
                }
            }
        });

        this.initPing_();
        // HUD有効
        var hud = bq.Hud.getInstance();
        hud.enable(true);

        bq.space = this.createPhysicalSpace_(tileMap.getContentSize());

        // 当たり判定のコールバック
        bq.space.addCollisionHandler( 1, 2, // TODO 変数にしないとダメ
            this.collisionBegin.bind(this)
        );


        this._debugNode = cc.PhysicsDebugNode.create( bq.space );
        this._debugNode.setVisible( true );
        baseLayer.addChild( this._debugNode );

        bq.space.addBody(bq.player.getBody());
        var shape = new cp.BoxShape(bq.player.getBody(), 32, 32);
        bq.space.addShape(shape);

        this.scheduleUpdate();


        //bq.soundManager.playMusic(s_BgmField, true);
        this.addChild(baseLayer, bq.config.zOrder.BASE_LAYER);
        bq.baseLayer = baseLayer;
        return true;
    },

    /** @override */
    update: function(bt) {
        'use strict';
        bq.space.step(bt);
    },

    initPing_: function() {
        'use strict';

        if (! cc.Director.getInstance().isDisplayStats()) {
            return;
        }

        // ping始める
        var interval = 300;
        this.ping_ = new bq.Ping(bq.Socket.getInstance().socket, interval);
        this.ping_.start();

        // 表示用テキストを作る
        var pingText = function() {
            return "ping: " + this.ping_.getRoundTripTime();
        }.bind(this);

        // ラベル作る
        var fontSize = 16;
        var pingLabel = bq.Label.createWithShadow(pingText(), fontSize);
        pingLabel.setAnchorPoint(cc.p(0, 1.0));

        // 表示位置
        var margin = 5;
        var winSize = cc.Director.getInstance().getWinSize();
        pingLabel.setPosition(cc.p(margin, winSize.height - margin));

        // 表示内容更新処理
        pingLabel.schedule(function() {
            pingLabel.setString(pingText());
        });

        var zIndex = 10000;
        this.addChild(pingLabel, zIndex, bq.config.zOrder.DEBUG_PING);
    },

    createPhysicalSpace_: function(size) {

        var space = new cp.Space();
        var staticBody = space.staticBody;
        // Walls
        var walls = [
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(size.width,0), 0 ),				// bottom
            new cp.SegmentShape( staticBody, cp.v(0,size.height), cp.v(size.width,size.height), 0),	// top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,size.height), 0),				// left
            new cp.SegmentShape( staticBody, cp.v(size.width,0), cp.v(size.width,size.height), 0)	// right
        ];
        for( var i=0; i < walls.length; i++ ) { // TODO use underscore.js
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        space.gravity = cp.v(0, 0);


        return space;
    },

    collisionBegin : function ( arbiter, space ) {

        var shapes = arbiter.getShapes();
        space.addPostStepCallback(function(){
            var data = {};
            data.entity  = shapes[1].sprite.getModel(); // TODO this.sprite やめなよ
            data.beamPos = shapes[1].sprite.getPosition();
            data.hpAmount = -10; // これも
            data.beamTag = shapes[0].sprite.tag;

            bq.EntityManager.getInstance().hitEntity(data);
        })

        return true;
    }
});

bq.scene.BeamQuestWorldScene = cc.Scene.extend({
    onEnter:function () {
        'use strict';

        this._super();
        if (this.isAlreadyLogin_(bq.player.name)) {
            var layer = new bq.scene.BeamQuestWorld();
            layer.init();
            this.addChild(layer);
            this.renderEntities_(1); // TODO: mapIdが固定なのをなんとかする
            this.renderDropItems_(1);// TODO: mapIdが固定なのをなんとかする
        } else {
            this.addChild(new bq.scene.LoginScene());
        }
    },

    /**
     * 他Entityを描画する
     * @param {number} mapId
     * @private
     */
    renderEntities_: function(mapId) {
        var entityManager = bq.EntityManager.getInstance();
        entityManager.updateEntitiesByMapId(mapId);
    },

    /**
     * ドロップアイテムを描画する
     * @param {number} mapId
     * @private
     */
    renderDropItems_: function(mapId) {
        bq.mapManager.updateDropItemsByMapId(mapId);
    },

    /**
     * @param {string} userId
     * @return {boolean} ログイン済み（過去にログインしたことがある)ならTRUE
     * @private
     */
    isAlreadyLogin_: function(userId) {
        'use strict';

        userId = sys.localStorage.getItem('userHash:' + userId);
        return !!userId;
    }
});
