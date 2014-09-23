bq.scene.BeamQuestWorld = cc.Layer.extend({
    init:function () {
        'use strict';

        this._super();

        // TODO position.mapIdからロードするマップを取得する
        var tileMap = new cc.TMXTiledMap(bq.config.maps.area.START_MURA);
        tileMap.setPosition(cc.p(0,0));

        var behindMapLayer = tileMap.getLayer('GoBehind');
        if (behindMapLayer) {
            behindMapLayer.setLocalZOrder(bq.config.zOrder.BEHIND_LAYER);
        }
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
        cc.eventManager.addListener(bq.player.inputHandler.getMouseListener(), this);
        cc.eventManager.addListener(bq.player.inputHandler.getKeyboardListener(), this);
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function(key) {
                if (key === cc.KEY.enter) {
                    chat.focusChat();
                }
            }
        }, this);

        this.initPing_();
        // HUD有効
        var hud = bq.Hud.getInstance();
        hud.enable(true);

        bq.space = this.createPhysicalSpace_(tileMap.getContentSize());

        // 当たり判定のコールバック
        // TODO クライアントのコッチ使うようにする（まだサーバサイドできてないのでダメ）
        // bq.space.addCollisionHandler( 1, 2,
        //     bq.EntityManager.getInstance().collisionCallback
        // );

        // add Physics Debug
        this._debugNode = cc.PhysicsDebugNode.create(bq.space);
        this._debugNode.setVisible(false); // 物理の箱見たいときはtrueに
        baseLayer.addChild(this._debugNode);

        // add player physical box
        var shape = new cp.BoxShape(bq.player.getBody(), 32, 32);
        bq.space.addShape(shape);

        this.scheduleUpdate();
        bq.soundManager.playMusic(s_BgmField2, true);
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

        if (! cc.director.isDisplayStats()) {
            return;
        }

        var pingLayer = new bq.scene.layer.PingLayer();
        var zIndex = 10000;
        this.addChild(pingLayer, zIndex, bq.config.zOrder.DEBUG_PING);
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
        _.forEach(walls, function(shape) {
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape(shape);
        });

        space.gravity = cp.v(0, 0);

        return space;
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

        userId = cc.sys.localStorage.getItem('userHash:' + userId);
        return !!userId;
    }
});
